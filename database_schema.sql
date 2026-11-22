-- ============================================
-- CGK FIDS - Supabase Database Schema
-- ============================================
-- Jalankan SQL ini di Supabase Dashboard > SQL Editor
-- Klik "New Query" > Paste semua kode ini > Klik "Run"
-- ============================================

-- 1. Tabel Utama: flights
CREATE TABLE IF NOT EXISTS flights (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    flight_number TEXT NOT NULL,
    airline TEXT NOT NULL,
    flight_type TEXT NOT NULL CHECK (flight_type IN ('departure', 'arrival')),
    origin TEXT,           -- Kota asal (untuk arrival), contoh: 'Surabaya (SUB)'
    destination TEXT,      -- Kota tujuan (untuk departure), contoh: 'Bali (DPS)'
    terminal TEXT NOT NULL CHECK (terminal IN ('1', '2', '3')),
    gate TEXT DEFAULT '-',
    counter TEXT DEFAULT '-',  -- Check-in counter (departure) atau Baggage belt (arrival)
    scheduled_time TIMESTAMPTZ NOT NULL,
    estimated_time TIMESTAMPTZ,
    actual_time TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'Scheduled' 
        CHECK (status IN ('Scheduled', 'Check-in', 'Boarding', 'Final Call', 'Departed', 'Delayed', 'Cancelled', 'Landed', 'Baggage Claim', 'Arrived', 'On Time')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    remarks TEXT,
    source TEXT DEFAULT 'manual',  -- 'api' atau 'manual'
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index untuk query cepat
CREATE INDEX IF NOT EXISTS idx_flights_terminal ON flights(terminal);
CREATE INDEX IF NOT EXISTS idx_flights_type ON flights(flight_type);
CREATE INDEX IF NOT EXISTS idx_flights_status ON flights(status);
CREATE INDEX IF NOT EXISTS idx_flights_scheduled ON flights(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_flights_updated ON flights(updated_at);

-- 3. Tabel Log Sinkronisasi API
CREATE TABLE IF NOT EXISTS sync_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sync_type TEXT NOT NULL DEFAULT 'api_fetch',  -- 'api_fetch', 'manual_insert', 'cron_job'
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'error', 'partial')),
    flights_updated INTEGER DEFAULT 0,
    flights_inserted INTEGER DEFAULT 0,
    error_message TEXT,
    api_source TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Konfigurasi Sistem
CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default system config
INSERT INTO system_config (key, value) VALUES 
    ('aviation_api_key', ''),
    ('aviation_api_provider', 'aviationstack'),
    ('sync_interval_active', '30'),
    ('sync_interval_schedule', '300'),
    ('last_sync_timestamp', ''),
    ('api_status', 'offline')
ON CONFLICT (key) DO NOTHING;

-- 5. Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger: Auto-update updated_at on flights table
DROP TRIGGER IF EXISTS set_updated_at ON flights;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON flights
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- 7. Enable Realtime on flights table (SANGAT PENTING!)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'flights'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE flights;
    END IF;
END $$;

-- 8. Row Level Security (RLS) - Proteksi Akses Data
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- A. Tabel FLIGHTS:
-- Semua orang boleh membaca data jadwal penerbangan publik (CGK FIDS Board)
DROP POLICY IF EXISTS "Public read flights" ON flights;
CREATE POLICY "Public read flights" ON flights
    FOR SELECT USING (true);

-- HANYA backend / Edge Function (service_role) yang boleh mengubah data penerbangan
DROP POLICY IF EXISTS "Service role write flights" ON flights;
DROP POLICY IF EXISTS "Service role all flights" ON flights;
CREATE POLICY "Service role all flights" ON flights
    FOR ALL USING (auth.role() = 'service_role');

-- B. Tabel SYSTEM_CONFIG (SANGAT SENSITIF):
-- PERINGATAN KEAMANAN: Jangan izinkan publik membaca tabel ini!
-- Hanya backend / service_role yang boleh membaca & menulis konfigurasi dan API Key.
DROP POLICY IF EXISTS "Public read system_config" ON system_config;
DROP POLICY IF EXISTS "Service role write system_config" ON system_config;
DROP POLICY IF EXISTS "Service role all system_config" ON system_config;
CREATE POLICY "Service role all system_config" ON system_config
    FOR ALL USING (auth.role() = 'service_role');

-- C. Tabel SYNC_LOGS:
-- Hanya service_role yang boleh mencatat log
DROP POLICY IF EXISTS "Service role write sync_logs" ON sync_logs;
DROP POLICY IF EXISTS "Service role all sync_logs" ON sync_logs;
CREATE POLICY "Service role all sync_logs" ON sync_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Publik boleh melihat ringkasan log untuk status monitor
DROP POLICY IF EXISTS "Public read sync_logs" ON sync_logs;
CREATE POLICY "Public read sync_logs" ON sync_logs
    FOR SELECT USING (true);

-- 9. View: Status Publik & Statistik Terminal (Aman dari Kebocoran Kunci Rahasia)

-- View status yang aman: Hanya mengekspos status operasional, otomatis memfilter kunci rahasia/token
CREATE OR REPLACE VIEW public_system_status AS
SELECT key, value, updated_at
FROM system_config
WHERE key NOT ILIKE '%key%' 
  AND key NOT ILIKE '%secret%' 
  AND key NOT ILIKE '%token%' 
  AND key NOT ILIKE '%password%'
  AND key NOT ILIKE '%auth%';

-- Berikan izin akses SELECT view ke pengguna publik/anon
GRANT SELECT ON public_system_status TO anon, authenticated;

-- View Ringkasan statistik per terminal (untuk Dashboard)
CREATE OR REPLACE VIEW terminal_stats AS
SELECT 
    terminal,
    COUNT(*) FILTER (WHERE flight_type = 'departure') AS departures,
    COUNT(*) FILTER (WHERE flight_type = 'arrival') AS arrivals,
    COUNT(*) FILTER (WHERE status NOT IN ('Cancelled', 'Departed', 'Landed', 'Baggage Claim', 'Arrived')) AS active_flights,
    COUNT(*) AS total_flights
FROM flights
WHERE scheduled_time::date = CURRENT_DATE
GROUP BY terminal
ORDER BY terminal;

GRANT SELECT ON terminal_stats TO anon, authenticated;

-- 10. Masukkan data sampel awal (opsional - bisa dihapus setelah API terhubung)
-- Data ini akan digantikan oleh data real-time dari API penerbangan
-- Uncomment baris di bawah jika ingin melihat data langsung sebelum API terhubung:

/*
INSERT INTO flights (flight_number, airline, flight_type, destination, terminal, gate, counter, scheduled_time, status, progress, source) VALUES
('GA 204', 'Garuda Indonesia', 'departure', 'Bali (DPS)', '3', 'Gate 11', 'Row F01-F08', NOW() + INTERVAL '2 hours', 'Scheduled', 0, 'manual'),
('SQ 951', 'Singapore Airlines', 'departure', 'Singapore (SIN)', '3', 'Gate 22', 'Row C11-C18', NOW() + INTERVAL '3 hours', 'Scheduled', 0, 'manual'),
('JT 510', 'Lion Air', 'departure', 'Surabaya (SUB)', '1', 'Gate A1', 'Row 1-4', NOW() + INTERVAL '1 hour', 'Boarding', 65, 'manual'),
('QZ 7520', 'AirAsia Indonesia', 'departure', 'Kuala Lumpur (KUL)', '2', 'Gate D1', 'Row E01-E06', NOW() - INTERVAL '1 hour', 'Departed', 100, 'manual');
*/

-- ============================================
-- SELESAI! Database siap digunakan.
-- ============================================
