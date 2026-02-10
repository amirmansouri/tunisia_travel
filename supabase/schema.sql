-- =====================================================
-- TUNISIA TRAVEL - DATABASE SCHEMA
-- =====================================================
-- Run this SQL in Supabase SQL Editor to set up your database
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: programs
-- Stores all travel programs/tours
-- =====================================================
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure end_date is after start_date
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Create index for faster queries on published programs
CREATE INDEX IF NOT EXISTS idx_programs_published ON programs(published);
CREATE INDEX IF NOT EXISTS idx_programs_start_date ON programs(start_date);
CREATE INDEX IF NOT EXISTS idx_programs_created_at ON programs(created_at DESC);

-- =====================================================
-- TABLE: reservations
-- Stores customer reservations for programs
-- =====================================================
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups by program
CREATE INDEX IF NOT EXISTS idx_reservations_program_id ON reservations(program_id);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);

-- =====================================================
-- FUNCTION: Update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on programs
DROP TRIGGER IF EXISTS update_programs_updated_at ON programs;
CREATE TRIGGER update_programs_updated_at
    BEFORE UPDATE ON programs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on programs table
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read published programs
CREATE POLICY "Public can view published programs"
    ON programs
    FOR SELECT
    TO anon
    USING (published = true);

-- Policy: Authenticated users (service role) have full access to programs
CREATE POLICY "Service role has full access to programs"
    ON programs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow service role full access via postgres role
CREATE POLICY "Postgres role has full access to programs"
    ON programs
    FOR ALL
    TO postgres
    USING (true)
    WITH CHECK (true);

-- Enable RLS on reservations table
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Policy: Public can insert reservations
CREATE POLICY "Public can create reservations"
    ON reservations
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Public can view their own reservations (by email - optional)
CREATE POLICY "Public can view reservations"
    ON reservations
    FOR SELECT
    TO anon
    USING (true);

-- Policy: Service role has full access to reservations
CREATE POLICY "Service role has full access to reservations"
    ON reservations
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Postgres role has full access to reservations
CREATE POLICY "Postgres role has full access to reservations"
    ON reservations
    FOR ALL
    TO postgres
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- STORAGE BUCKET SETUP
-- Run these in Supabase SQL Editor or via Dashboard
-- =====================================================

-- Create storage bucket for program images
INSERT INTO storage.buckets (id, name, public)
VALUES ('program-images', 'program-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public to read images
CREATE POLICY "Public can view program images"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'program-images');

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'program-images');

-- Policy: Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'program-images');

-- Policy: Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'program-images');

-- =====================================================
-- VIEWS (Optional - for easier queries)
-- =====================================================

-- View for published programs with reservation count
CREATE OR REPLACE VIEW public_programs_with_stats AS
SELECT
    p.*,
    COUNT(r.id) as reservation_count
FROM programs p
LEFT JOIN reservations r ON p.id = r.program_id
WHERE p.published = true
GROUP BY p.id;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant permissions on tables
GRANT SELECT ON programs TO anon;
GRANT ALL ON programs TO authenticated;

GRANT INSERT, SELECT ON reservations TO anon;
GRANT ALL ON reservations TO authenticated;

-- Grant permissions on views
GRANT SELECT ON public_programs_with_stats TO anon;
GRANT SELECT ON public_programs_with_stats TO authenticated;

-- =====================================================
-- TABLE: live_events
-- Stores live events (matches and general events)
-- =====================================================
CREATE TABLE IF NOT EXISTS live_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL CHECK (event_type IN ('match', 'general')),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    -- Match-specific fields (null for general events)
    team_a TEXT,
    team_b TEXT,
    score_a INTEGER DEFAULT 0,
    score_b INTEGER DEFAULT 0,
    match_status TEXT CHECK (match_status IN ('upcoming', 'live', 'halftime', 'finished', NULL)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_events_active ON live_events(is_active);
CREATE INDEX IF NOT EXISTS idx_live_events_event_date ON live_events(event_date);
CREATE INDEX IF NOT EXISTS idx_live_events_type ON live_events(event_type);

-- Trigger to auto-update updated_at on live_events
DROP TRIGGER IF EXISTS update_live_events_updated_at ON live_events;
CREATE TRIGGER update_live_events_updated_at
    BEFORE UPDATE ON live_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on live_events
ALTER TABLE live_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active events"
    ON live_events FOR SELECT TO anon
    USING (is_active = true);

CREATE POLICY "Service role has full access to live_events"
    ON live_events FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Postgres role has full access to live_events"
    ON live_events FOR ALL TO postgres
    USING (true) WITH CHECK (true);

GRANT SELECT ON live_events TO anon;
GRANT ALL ON live_events TO authenticated;

-- =====================================================
-- TABLE: site_settings
-- Key-value store for global site settings
-- =====================================================
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to auto-update updated_at on site_settings
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
    ON site_settings FOR SELECT TO anon
    USING (true);

CREATE POLICY "Service role has full access to site_settings"
    ON site_settings FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Postgres role has full access to site_settings"
    ON site_settings FOR ALL TO postgres
    USING (true) WITH CHECK (true);

GRANT SELECT ON site_settings TO anon;
GRANT ALL ON site_settings TO authenticated;

-- Seed the live events toggle
INSERT INTO site_settings (key, value)
VALUES ('live_events_enabled', '{"enabled": false}')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- TABLE: tournaments
-- Stores pétanque tournaments
-- =====================================================
CREATE TABLE IF NOT EXISTS tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    image_url TEXT,
    max_teams INTEGER DEFAULT 32,
    num_pools INTEGER DEFAULT 4,
    status TEXT NOT NULL DEFAULT 'registration' CHECK (status IN ('registration', 'pools', 'knockout', 'finished')),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_published ON tournaments(is_published);
CREATE INDEX IF NOT EXISTS idx_tournaments_start_date ON tournaments(start_date);

DROP TRIGGER IF EXISTS update_tournaments_updated_at ON tournaments;
CREATE TRIGGER update_tournaments_updated_at
    BEFORE UPDATE ON tournaments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published tournaments"
    ON tournaments FOR SELECT TO anon
    USING (is_published = true);

CREATE POLICY "Service role has full access to tournaments"
    ON tournaments FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Postgres role has full access to tournaments"
    ON tournaments FOR ALL TO postgres
    USING (true) WITH CHECK (true);

GRANT SELECT ON tournaments TO anon;
GRANT ALL ON tournaments TO authenticated;

-- =====================================================
-- TABLE: tournament_teams
-- Stores teams registered for tournaments
-- =====================================================
CREATE TABLE IF NOT EXISTS tournament_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    country TEXT,
    captain_name TEXT,
    captain_phone TEXT,
    captain_email TEXT,
    pool TEXT,
    seed INTEGER,
    is_confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tournament_teams_tournament ON tournament_teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_teams_pool ON tournament_teams(pool);

ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view tournament teams"
    ON tournament_teams FOR SELECT TO anon
    USING (EXISTS (SELECT 1 FROM tournaments WHERE tournaments.id = tournament_teams.tournament_id AND tournaments.is_published = true));

CREATE POLICY "Public can register teams"
    ON tournament_teams FOR INSERT TO anon
    WITH CHECK (EXISTS (SELECT 1 FROM tournaments WHERE tournaments.id = tournament_teams.tournament_id AND tournaments.is_published = true AND tournaments.status = 'registration'));

CREATE POLICY "Service role has full access to tournament_teams"
    ON tournament_teams FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Postgres role has full access to tournament_teams"
    ON tournament_teams FOR ALL TO postgres
    USING (true) WITH CHECK (true);

GRANT SELECT, INSERT ON tournament_teams TO anon;
GRANT ALL ON tournament_teams TO authenticated;

-- =====================================================
-- TABLE: tournament_matches
-- Stores matches within tournaments
-- =====================================================
CREATE TABLE IF NOT EXISTS tournament_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    round_type TEXT NOT NULL CHECK (round_type IN ('pool', 'quarter', 'semi', 'final', '3rd_place')),
    pool TEXT,
    match_number INTEGER NOT NULL DEFAULT 0,
    team_a_id UUID REFERENCES tournament_teams(id) ON DELETE SET NULL,
    team_b_id UUID REFERENCES tournament_teams(id) ON DELETE SET NULL,
    score_a INTEGER DEFAULT 0,
    score_b INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished')),
    scheduled_time TIMESTAMP WITH TIME ZONE,
    court TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tournament_matches_tournament ON tournament_matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_matches_round ON tournament_matches(round_type);
CREATE INDEX IF NOT EXISTS idx_tournament_matches_status ON tournament_matches(status);

DROP TRIGGER IF EXISTS update_tournament_matches_updated_at ON tournament_matches;
CREATE TRIGGER update_tournament_matches_updated_at
    BEFORE UPDATE ON tournament_matches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE tournament_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view tournament matches"
    ON tournament_matches FOR SELECT TO anon
    USING (EXISTS (SELECT 1 FROM tournaments WHERE tournaments.id = tournament_matches.tournament_id AND tournaments.is_published = true));

CREATE POLICY "Service role has full access to tournament_matches"
    ON tournament_matches FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Postgres role has full access to tournament_matches"
    ON tournament_matches FOR ALL TO postgres
    USING (true) WITH CHECK (true);

GRANT SELECT ON tournament_matches TO anon;
GRANT ALL ON tournament_matches TO authenticated;

-- =====================================================
-- TABLE: tournament_standings
-- Stores pool standings for tournaments
-- =====================================================
CREATE TABLE IF NOT EXISTS tournament_standings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES tournament_teams(id) ON DELETE CASCADE,
    pool TEXT NOT NULL,
    played INTEGER DEFAULT 0,
    won INTEGER DEFAULT 0,
    lost INTEGER DEFAULT 0,
    drawn INTEGER DEFAULT 0,
    points_for INTEGER DEFAULT 0,
    points_against INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_tournament_standings_tournament ON tournament_standings(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_standings_pool ON tournament_standings(pool);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tournament_standings_unique ON tournament_standings(tournament_id, team_id);

ALTER TABLE tournament_standings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view tournament standings"
    ON tournament_standings FOR SELECT TO anon
    USING (EXISTS (SELECT 1 FROM tournaments WHERE tournaments.id = tournament_standings.tournament_id AND tournaments.is_published = true));

CREATE POLICY "Service role has full access to tournament_standings"
    ON tournament_standings FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Postgres role has full access to tournament_standings"
    ON tournament_standings FOR ALL TO postgres
    USING (true) WITH CHECK (true);

GRANT SELECT ON tournament_standings TO anon;
GRANT ALL ON tournament_standings TO authenticated;
