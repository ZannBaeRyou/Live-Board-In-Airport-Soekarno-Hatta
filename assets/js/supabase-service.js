/**
 * CGK FIDS - Supabase Flight Data Service
 * =========================================
 * Modul ini menangani SEMUA komunikasi antara frontend dan Supabase:
 * - Inisialisasi koneksi Supabase
 * - Mengambil data penerbangan (SELECT)
 * - Berlangganan perubahan data real-time (WebSocket/Realtime)
 * - Menyediakan fallback jika koneksi terputus
 * - Menampilkan status sinkronisasi terakhir
 */

// ============================================
// INISIALISASI SUPABASE CLIENT
// ============================================
let supabaseClient = null;
let realtimeChannel = null;
let isSupabaseConnected = false;
let lastSyncTimestamp = null;
let connectionRetryCount = 0;
const MAX_RETRY = 5;
const RETRY_DELAY_MS = 5000;

/**
 * Inisialisasi koneksi ke Supabase.
 * Dipanggil saat DOMContentLoaded di main.js
 */
function initSupabase() {
    if (!SUPABASE_CONFIG || !SUPABASE_CONFIG.url || SUPABASE_CONFIG.url.includes('YOUR_PROJECT')) {
        console.warn('[FIDS] Supabase belum dikonfigurasi. Menggunakan data offline/cache.');
        showSyncStatus('offline', 'Supabase belum dikonfigurasi');
        return false;
    }

    try {
        const { createClient } = supabase;
        supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
            realtime: {
                params: {
                    eventsPerSecond: 10
                }
            }
        });
        isSupabaseConnected = true;
        connectionRetryCount = 0;
        console.log('[FIDS] Supabase berhasil terhubung!');
        showSyncStatus('online', 'Terhubung ke server');
        return true;
    } catch (err) {
        console.error('[FIDS] Gagal menghubungkan Supabase:', err);
        isSupabaseConnected = false;
        showSyncStatus('error', 'Gagal terhubung: ' + err.message);
        return false;
    }
}

// ============================================
// MENGAMBIL DATA PENERBANGAN DARI DATABASE
// ============================================

/**
 * Mengambil semua penerbangan hari ini untuk terminal tertentu.
 * @param {string} terminal - Nomor terminal ('1', '2', atau '3')
 * @returns {Promise<Array>} Array of flight objects
 */
async function fetchFlights(terminal) {
    if (!supabaseClient) {
        console.warn('[FIDS] Supabase client belum aktif.');
        return [];
    }

    try {
        // Ambil tanggal hari ini dalam timezone Jakarta
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        let query = supabaseClient
            .from('flights')
            .select('*')
            .gte('scheduled_time', todayStart.toISOString())
            .lte('scheduled_time', todayEnd.toISOString())
            .order('scheduled_time', { ascending: true });

        // Filter per terminal jika ada
        if (terminal) {
            query = query.eq('terminal', terminal);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[FIDS] Error mengambil data:', error);
            showSyncStatus('error', 'Gagal mengambil data: ' + error.message);
            return getCachedFlights(terminal);
        }

        // Simpan ke localStorage sebagai cache/fallback
        saveCachedFlights(terminal, data);
        
        lastSyncTimestamp = new Date();
        showSyncStatus('online', 'Data terbaru');

        return data.map(transformFlightData);
    } catch (err) {
        console.error('[FIDS] Exception saat mengambil data:', err);
        showSyncStatus('error', 'Koneksi terputus');
        return getCachedFlights(terminal);
    }
}

/**
 * Mengambil semua penerbangan hari ini untuk semua terminal (Dashboard).
 * @returns {Promise<Object>} Object dengan key terminal -> array flights
 */
async function fetchAllFlights() {
    if (!supabaseClient) {
        return { '1': [], '2': [], '3': [] };
    }

    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const { data, error } = await supabaseClient
            .from('flights')
            .select('*')
            .gte('scheduled_time', todayStart.toISOString())
            .lte('scheduled_time', todayEnd.toISOString())
            .order('scheduled_time', { ascending: true });

        if (error) {
            console.error('[FIDS] Error mengambil semua data:', error);
            return { '1': [], '2': [], '3': [] };
        }

        // Kelompokkan per terminal
        const grouped = { '1': [], '2': [], '3': [] };
        data.forEach(flight => {
            if (grouped[flight.terminal]) {
                grouped[flight.terminal].push(transformFlightData(flight));
            }
        });

        lastSyncTimestamp = new Date();
        return grouped;
    } catch (err) {
        console.error('[FIDS] Exception:', err);
        return { '1': [], '2': [], '3': [] };
    }
}

/**
 * Mengambil statistik ringkasan per terminal (untuk Dashboard cards).
 * @returns {Promise<Object>} Stats per terminal
 */
async function fetchTerminalStats() {
    if (!supabaseClient) {
        return {};
    }

    try {
        const { data, error } = await supabaseClient
            .from('terminal_stats')
            .select('*');

        if (error) {
            console.error('[FIDS] Error mengambil statistik:', error);
            return {};
        }

        const stats = {};
        data.forEach(row => {
            stats[row.terminal] = {
                departures: row.departures,
                arrivals: row.arrivals,
                active: row.active_flights,
                total: row.total_flights
            };
        });
        return stats;
    } catch (err) {
        return {};
    }
}

// ============================================
// REALTIME SUBSCRIPTION (WEBSOCKET)
// ============================================

/**
 * Berlangganan perubahan data penerbangan secara real-time.
 * @param {string|null} terminal - Filter terminal (null = semua)
 * @param {function} onInsert - Callback saat ada penerbangan baru
 * @param {function} onUpdate - Callback saat ada perubahan data
 * @param {function} onDelete - Callback saat ada penerbangan dihapus
 */
function subscribeToFlights(terminal, onInsert, onUpdate, onDelete) {
    if (!supabaseClient) {
        console.warn('[FIDS] Tidak dapat subscribe - Supabase belum aktif.');
        return;
    }

    // Hapus channel lama jika ada
    if (realtimeChannel) {
        supabaseClient.removeChannel(realtimeChannel);
    }

    const channelName = terminal ? `fids-terminal-${terminal}` : 'fids-all-terminals';
    
    let channelConfig = {
        event: '*',
        schema: 'public',
        table: 'flights'
    };

    // Filter per terminal jika perlu
    if (terminal) {
        channelConfig.filter = `terminal=eq.${terminal}`;
    }

    realtimeChannel = supabaseClient
        .channel(channelName)
        .on('postgres_changes', channelConfig, (payload) => {
            console.log('[FIDS] Realtime event:', payload.eventType, payload);
            
            const flight = payload.new ? transformFlightData(payload.new) : null;
            const oldFlight = payload.old ? transformFlightData(payload.old) : null;

            switch (payload.eventType) {
                case 'INSERT':
                    if (onInsert && flight) onInsert(flight);
                    break;
                case 'UPDATE':
                    if (onUpdate && flight) onUpdate(flight, oldFlight);
                    highlightUpdatedRow(flight);
                    break;
                case 'DELETE':
                    if (onDelete && oldFlight) onDelete(oldFlight);
                    break;
            }

            lastSyncTimestamp = new Date();
            showSyncStatus('online', 'Update real-time diterima');
        })
        .subscribe((status) => {
            console.log('[FIDS] Realtime status:', status);
            if (status === 'SUBSCRIBED') {
                showSyncStatus('online', 'Real-time aktif');
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                showSyncStatus('error', 'Koneksi real-time terputus');
                attemptReconnect(terminal, onInsert, onUpdate, onDelete);
            }
        });
}

/**
 * Coba koneksi ulang jika terputus
 */
function attemptReconnect(terminal, onInsert, onUpdate, onDelete) {
    if (connectionRetryCount >= MAX_RETRY) {
        showSyncStatus('error', 'Gagal menghubungkan ulang setelah ' + MAX_RETRY + ' percobaan');
        return;
    }
    connectionRetryCount++;
    console.log(`[FIDS] Mencoba koneksi ulang... (${connectionRetryCount}/${MAX_RETRY})`);
    
    setTimeout(() => {
        subscribeToFlights(terminal, onInsert, onUpdate, onDelete);
    }, RETRY_DELAY_MS * connectionRetryCount);
}

// ============================================
// TRANSFORMASI DATA (DB -> Format Frontend)
// ============================================

/**
 * Mengubah format data dari database Supabase ke format yang digunakan oleh UI.
 * @param {Object} dbFlight - Data mentah dari database
 * @returns {Object} Flight object dalam format UI
 */
function transformFlightData(dbFlight) {
    if (!dbFlight) return null;
    
    const scheduledDate = new Date(dbFlight.scheduled_time);
    const estimatedDate = dbFlight.estimated_time ? new Date(dbFlight.estimated_time) : scheduledDate;
    
    // Format waktu ke HH:MM (WIB / Asia/Jakarta)
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' };
    const scheduledTimeStr = scheduledDate.toLocaleTimeString('id-ID', timeOptions);
    const estimatedTimeStr = estimatedDate.toLocaleTimeString('id-ID', timeOptions);
    
    // Generate estimated time label
    let estLabel = '';
    if (dbFlight.status === 'Delayed') {
        estLabel = `${estimatedTimeStr} (Estimasi)`;
    } else if (['Landed', 'Departed', 'Baggage Claim'].includes(dbFlight.status)) {
        const actualDate = dbFlight.actual_time ? new Date(dbFlight.actual_time) : estimatedDate;
        const actualTimeStr = actualDate.toLocaleTimeString('id-ID', timeOptions);
        estLabel = `${actualTimeStr} (Aktual)`;
    } else {
        estLabel = `${estimatedTimeStr} (On Time)`;
    }

    // Extract IATA code from flight number (e.g., 'GA 208' -> 'GA')
    const iataCode = dbFlight.flight_number ? dbFlight.flight_number.split(' ')[0].trim() : '';
    // Use Aviasales CDN for airline logos (supports square format and fallback)
    const logoUrl = iataCode ? `https://pics.avs.io/64/64/${iataCode}.png` : '';

    return {
        id: `flight-${dbFlight.id}`,
        dbId: dbFlight.id,
        type: dbFlight.flight_type,
        number: dbFlight.flight_number,
        airline: dbFlight.airline,
        logo: logoUrl,
        origin: dbFlight.origin || '',
        destination: dbFlight.destination || '',
        terminal: dbFlight.terminal,
        time: scheduledTimeStr,
        estimatedTime: estLabel,
        status: dbFlight.status,
        progress: dbFlight.progress || 0,
        gate: dbFlight.gate ? `Gate ${dbFlight.gate}` : 'Gate -',
        counter: dbFlight.counter || '-',
        baggage: dbFlight.counter || '-',  // counter field doubles as baggage belt for arrivals
        remarks: dbFlight.remarks || '',
        updatedAt: dbFlight.updated_at,
        source: dbFlight.source
    };
}

// ============================================
// CACHE / FALLBACK (localStorage)
// ============================================

function saveCachedFlights(terminal, data) {
    try {
        const cacheKey = `fids_cache_t${terminal || 'all'}`;
        localStorage.setItem(cacheKey, JSON.stringify({
            data: data,
            timestamp: new Date().toISOString()
        }));
    } catch (e) {
        // localStorage penuh atau tidak tersedia
    }
}

function getCachedFlights(terminal) {
    try {
        const cacheKey = `fids_cache_t${terminal || 'all'}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const parsed = JSON.parse(cached);
            const cacheAge = Date.now() - new Date(parsed.timestamp).getTime();
            
            // Tampilkan peringatan jika cache lebih dari 5 menit
            const minutesAgo = Math.floor(cacheAge / 60000);
            showSyncStatus('stale', `Data terakhir diperbarui ${minutesAgo} menit lalu`);
            
            return parsed.data.map(transformFlightData);
        }
    } catch (e) {
        // Cache rusak atau tidak tersedia
    }
    return [];
}

// ============================================
// UI HELPERS
// ============================================

/**
 * Menampilkan status sinkronisasi di UI
 */
function showSyncStatus(status, message) {
    const el = document.getElementById('sync-status');
    if (!el) return;

    let icon, colorClass, dotClass;
    switch (status) {
        case 'online':
            icon = 'fa-circle-check';
            colorClass = 'text-success';
            dotClass = 'sync-dot-online';
            break;
        case 'error':
            icon = 'fa-circle-xmark';
            colorClass = 'text-danger';
            dotClass = 'sync-dot-error';
            break;
        case 'stale':
            icon = 'fa-clock-rotate-left';
            colorClass = 'text-warning';
            dotClass = 'sync-dot-stale';
            break;
        case 'offline':
        default:
            icon = 'fa-circle-minus';
            colorClass = 'text-secondary';
            dotClass = 'sync-dot-offline';
            break;
    }

    el.innerHTML = `
        <span class="sync-dot ${dotClass}"></span>
        <i class="fa-solid ${icon} ${colorClass} me-1"></i>
        <span class="${colorClass}">${message}</span>
    `;
    el.className = `sync-status-bar ${status}`;
}

/**
 * Highlight baris yang baru saja diperbarui (efek kedip kuning)
 */
function highlightUpdatedRow(flight) {
    if (!flight) return;
    const row = document.querySelector(`[data-flight-id="${flight.id}"]`);
    if (row) {
        row.classList.add('fids-row-updated');
        setTimeout(() => {
            row.classList.remove('fids-row-updated');
        }, 3000);
    }
}

// ============================================
// ADMIN / SYSTEM STATUS
// ============================================

/**
 * Mengambil data sistem untuk halaman admin
 */
async function fetchSystemStatus() {
    if (!supabaseClient) return null;

    try {
        // Ambil config
        const { data: config } = await supabaseClient
            .from('system_config')
            .select('*');

        // Ambil log sinkronisasi terakhir (10 terbaru)
        const { data: logs } = await supabaseClient
            .from('sync_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        // Ambil jumlah total penerbangan hari ini
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const { count: flightCount } = await supabaseClient
            .from('flights')
            .select('*', { count: 'exact', head: true })
            .gte('scheduled_time', todayStart.toISOString());

        // Ambil statistik
        const { data: stats } = await supabaseClient
            .from('terminal_stats')
            .select('*');

        return {
            config: config || [],
            logs: logs || [],
            flightCount: flightCount || 0,
            stats: stats || [],
            lastCheck: new Date().toISOString()
        };
    } catch (err) {
        console.error('[FIDS Admin] Error:', err);
        return null;
    }
}

// ============================================
// CLEANUP
// ============================================

/**
 * Bersihkan koneksi saat halaman ditutup
 */
window.addEventListener('beforeunload', () => {
    if (realtimeChannel && supabaseClient) {
        supabaseClient.removeChannel(realtimeChannel);
    }
});
