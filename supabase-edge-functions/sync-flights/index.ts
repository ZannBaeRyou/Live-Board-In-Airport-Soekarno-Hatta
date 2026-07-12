// ============================================
// CGK FIDS - Supabase Edge Function: sync-flights
// ============================================
// Deploy ini sebagai Edge Function di Supabase Dashboard.
// Masuk ke: Edge Functions > New Function > Paste kode ini.
//
// Edge Function ini bertugas:
// 1. Memanggil API Penerbangan (AviationStack / AviationEdge)
// 2. Mengubah format data ke skema tabel `flights`
// 3. Menyimpan/memperbarui data ke database Supabase
// 4. Mencatat log sinkronisasi ke tabel `sync_logs`
// ============================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// CGK Airport IATA Code
const AIRPORT_CODE = 'CGK';

// Mapping Terminal berdasarkan maskapai (sesuai CGK Soekarno-Hatta)
const AIRLINE_TERMINAL_MAP = {
    // Terminal 1 (Domestik LCC)
    'Lion Air': '1', 'Batik Air': '1', 'Wings Air': '1',
    'Sriwijaya Air': '1', 'NAM Air': '1', 'Super Air Jet': '1',
    'TransNusa': '1',
    // Terminal 2 (Internasional LCC)
    'AirAsia': '2', 'AirAsia Indonesia': '2', 'Indonesia AirAsia': '2',
    'AirAsia X': '2', 'Indonesia AirAsia X': '2',
    'Scoot': '2', 'Jetstar': '2', 'Jetstar Asia': '2',
    'Cebu Pacific': '2', 'Lion Air International': '2',
    'VietJet Air': '2', 'Spring Airlines': '2',
    // Terminal 3 (FSC / Full Service Carrier)
    'Garuda Indonesia': '3', 'Citilink': '3',
    'Singapore Airlines': '3', 'Emirates': '3', 'Qatar Airways': '3',
    'Etihad Airways': '3', 'All Nippon Airways': '3', 'ANA': '3',
    'Japan Airlines': '3', 'Korean Air': '3', 'Malaysia Airlines': '3',
    'Cathay Pacific': '3', 'Thai Airways': '3', 'KLM': '3',
    'Turkish Airlines': '3', 'China Airlines': '3', 'EVA Air': '3',
    'Saudi Arabian Airlines': '3', 'Oman Air': '3', 'Philippine Airlines': '3',
    'Xiamen Airlines': '3', 'China Southern': '3',
};

// Deteksi terminal berdasarkan nama maskapai
function detectTerminal(airlineName) {
    if (!airlineName) return '3'; // Default ke Terminal 3

    for (const [keyword, terminal] of Object.entries(AIRLINE_TERMINAL_MAP)) {
        if (airlineName.toLowerCase().includes(keyword.toLowerCase())) {
            return terminal;
        }
    }
    return '3'; // Default
}

// Mapping status dari API ke status FIDS kita
function mapFlightStatus(apiStatus) {
    if (!apiStatus) return 'Scheduled';
    const s = apiStatus.toLowerCase();
    
    if (s.includes('active') || s.includes('en-route') || s.includes('in air')) return 'Departed';
    if (s.includes('landed') || s.includes('arrived')) return 'Landed';
    if (s.includes('scheduled') || s.includes('planned')) return 'Scheduled';
    if (s.includes('cancelled') || s.includes('canceled')) return 'Cancelled';
    if (s.includes('delayed') || s.includes('diverted')) return 'Delayed';
    if (s.includes('boarding')) return 'Boarding';
    if (s.includes('check-in') || s.includes('checkin')) return 'Check-in';
    if (s.includes('final')) return 'Final Call';
    
    return 'Scheduled';
}

// Menghitung progress berdasarkan status
function calculateProgress(status) {
    switch (status) {
        case 'Scheduled': return 0;
        case 'Check-in': return 25;
        case 'Boarding': return 65;
        case 'Final Call': return 85;
        case 'Departed': return 100;
        case 'Delayed': return 10;
        case 'Cancelled': return 0;
        case 'Landed': return 100;
        case 'Baggage Claim': return 100;
        case 'Arrived': return 100;
        default: return 0;
    }
}

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    const startTime = Date.now();

    try {
        // Inisialisasi Supabase Client (dengan service role untuk write access)
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        );

        // Ambil API key dari system_config
        const { data: configData } = await supabase
            .from('system_config')
            .select('value')
            .eq('key', 'aviation_api_key')
            .single();

        const apiKey = configData?.value;

        if (!apiKey) {
            // Update status
            await supabase.from('system_config').upsert({ key: 'api_status', value: 'no_api_key' });
            
            // Log error
            await supabase.from('sync_logs').insert({
                sync_type: 'api_fetch',
                status: 'error',
                error_message: 'API Key belum dikonfigurasi. Masukkan API key di tabel system_config.',
                duration_ms: Date.now() - startTime,
            });

            return new Response(
                JSON.stringify({ error: 'API key belum dikonfigurasi' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Ambil provider API
        const { data: providerData } = await supabase
            .from('system_config')
            .select('value')
            .eq('key', 'aviation_api_provider')
            .single();

        const provider = providerData?.value || 'aviationstack';

        // ---- FETCH DATA DARI API PENERBANGAN ----
        let departures = [];
        let arrivals = [];

        if (provider === 'aviationstack') {
            // AviationStack API
            const depUrl = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=${AIRPORT_CODE}&limit=100`;
            const arrUrl = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&arr_iata=${AIRPORT_CODE}&limit=100`;

            const [depRes, arrRes] = await Promise.all([
                fetch(depUrl),
                fetch(arrUrl),
            ]);

            const depData = await depRes.json();
            const arrData = await arrRes.json();

            if (depData.data) {
                departures = depData.data.map(f => ({
                    flight_number: `${f.flight?.iata || f.flight?.icao || 'N/A'}`,
                    airline: f.airline?.name || 'Unknown',
                    flight_type: 'departure',
                    origin: `Jakarta (CGK)`,
                    destination: `${f.arrival?.airport || 'Unknown'} (${f.arrival?.iata || '?'})`,
                    terminal: f.departure?.terminal || detectTerminal(f.airline?.name),
                    gate: f.departure?.gate || '-',
                    counter: '-',
                    scheduled_time: f.departure?.scheduled || new Date().toISOString(),
                    estimated_time: f.departure?.estimated || f.departure?.scheduled,
                    actual_time: f.departure?.actual || null,
                    status: mapFlightStatus(f.flight_status),
                    progress: calculateProgress(mapFlightStatus(f.flight_status)),
                    source: 'api',
                }));
            }

            if (arrData.data) {
                arrivals = arrData.data.map(f => ({
                    flight_number: `${f.flight?.iata || f.flight?.icao || 'N/A'}`,
                    airline: f.airline?.name || 'Unknown',
                    flight_type: 'arrival',
                    origin: `${f.departure?.airport || 'Unknown'} (${f.departure?.iata || '?'})`,
                    destination: `Jakarta (CGK)`,
                    terminal: f.arrival?.terminal || detectTerminal(f.airline?.name),
                    gate: f.arrival?.gate || '-',
                    counter: f.arrival?.baggage || '-',
                    scheduled_time: f.arrival?.scheduled || new Date().toISOString(),
                    estimated_time: f.arrival?.estimated || f.arrival?.scheduled,
                    actual_time: f.arrival?.actual || null,
                    status: mapFlightStatus(f.flight_status),
                    progress: calculateProgress(mapFlightStatus(f.flight_status)),
                    source: 'api',
                }));
            }
        } else if (provider === 'aviationedge') {
            // AviationEdge API 
            const depUrl = `https://aviation-edge.com/v2/public/timetable?key=${apiKey}&iataCode=${AIRPORT_CODE}&type=departure`;
            const arrUrl = `https://aviation-edge.com/v2/public/timetable?key=${apiKey}&iataCode=${AIRPORT_CODE}&type=arrival`;

            const [depRes, arrRes] = await Promise.all([
                fetch(depUrl),
                fetch(arrUrl),
            ]);

            const depData = await depRes.json();
            const arrData = await arrRes.json();

            if (Array.isArray(depData)) {
                departures = depData.map(f => ({
                    flight_number: f.flight?.iataNumber || 'N/A',
                    airline: f.airline?.name || 'Unknown',
                    flight_type: 'departure',
                    origin: `Jakarta (CGK)`,
                    destination: `${f.arrival?.iataCode || '?'}`,
                    terminal: f.departure?.terminal || detectTerminal(f.airline?.name),
                    gate: f.departure?.gate || '-',
                    counter: '-',
                    scheduled_time: f.departure?.scheduledTime || new Date().toISOString(),
                    estimated_time: f.departure?.estimatedTime || f.departure?.scheduledTime,
                    actual_time: f.departure?.actualTime || null,
                    status: mapFlightStatus(f.status),
                    progress: calculateProgress(mapFlightStatus(f.status)),
                    source: 'api',
                }));
            }

            if (Array.isArray(arrData)) {
                arrivals = arrData.map(f => ({
                    flight_number: f.flight?.iataNumber || 'N/A',
                    airline: f.airline?.name || 'Unknown',
                    flight_type: 'arrival',
                    origin: `${f.departure?.iataCode || '?'}`,
                    destination: `Jakarta (CGK)`,
                    terminal: f.arrival?.terminal || detectTerminal(f.airline?.name),
                    gate: f.arrival?.gate || '-',
                    counter: f.arrival?.baggage || '-',
                    scheduled_time: f.arrival?.scheduledTime || new Date().toISOString(),
                    estimated_time: f.arrival?.estimatedTime || f.arrival?.scheduledTime,
                    actual_time: f.arrival?.actualTime || null,
                    status: mapFlightStatus(f.status),
                    progress: calculateProgress(mapFlightStatus(f.status)),
                    source: 'api',
                }));
            }
        }

        // ---- UPSERT DATA KE DATABASE ----
        const allFlights = [...departures, ...arrivals];
        let insertedCount = 0;
        let updatedCount = 0;

        for (const flight of allFlights) {
            // Cek apakah penerbangan sudah ada berdasarkan flight_number + scheduled_time
            const { data: existing } = await supabase
                .from('flights')
                .select('id')
                .eq('flight_number', flight.flight_number)
                .eq('scheduled_time', flight.scheduled_time)
                .maybeSingle();

            if (existing) {
                // Update yang sudah ada
                await supabase
                    .from('flights')
                    .update({
                        status: flight.status,
                        estimated_time: flight.estimated_time,
                        actual_time: flight.actual_time,
                        gate: flight.gate,
                        terminal: flight.terminal,
                        progress: flight.progress,
                        source: 'api',
                    })
                    .eq('id', existing.id);
                updatedCount++;
            } else {
                // Insert baru
                await supabase
                    .from('flights')
                    .insert(flight);
                insertedCount++;
            }
        }

        const durationMs = Date.now() - startTime;

        // Update system config
        await supabase.from('system_config').upsert([
            { key: 'last_sync_timestamp', value: new Date().toISOString() },
            { key: 'api_status', value: 'online' },
        ]);

        // Log sinkronisasi berhasil
        await supabase.from('sync_logs').insert({
            sync_type: 'api_fetch',
            status: 'success',
            flights_updated: updatedCount,
            flights_inserted: insertedCount,
            api_source: provider,
            duration_ms: durationMs,
        });

        return new Response(
            JSON.stringify({
                success: true,
                departures: departures.length,
                arrivals: arrivals.length,
                inserted: insertedCount,
                updated: updatedCount,
                duration_ms: durationMs,
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        const durationMs = Date.now() - startTime;
        
        // Log error (jika bisa)
        try {
            const supabase = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            );
            await supabase.from('system_config').upsert({ key: 'api_status', value: 'error' });
            await supabase.from('sync_logs').insert({
                sync_type: 'api_fetch',
                status: 'error',
                error_message: error.message,
                duration_ms: durationMs,
            });
        } catch (_) {}

        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
