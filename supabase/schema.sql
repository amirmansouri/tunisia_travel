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
