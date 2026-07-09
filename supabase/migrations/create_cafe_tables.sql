CREATE TABLE IF NOT EXISTS districts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  position_x NUMERIC NOT NULL,
  position_y NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS cafes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  district TEXT NOT NULL,
  address TEXT NOT NULL,
  hours TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating NUMERIC NOT NULL DEFAULT 0,
  price_range TEXT NOT NULL,
  signature_drinks JSONB NOT NULL DEFAULT '[]'::jsonb,
  tips JSONB NOT NULL DEFAULT '[]'::jsonb,
  vibe TEXT NOT NULL,
  description TEXT NOT NULL,
  image_prompt TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON cafes TO anon;
GRANT SELECT ON districts TO anon;
GRANT ALL ON cafes TO authenticated;
GRANT ALL ON districts TO authenticated;

CREATE POLICY "Allow public read on cafes" ON cafes
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on districts" ON districts
  FOR SELECT USING (true);
