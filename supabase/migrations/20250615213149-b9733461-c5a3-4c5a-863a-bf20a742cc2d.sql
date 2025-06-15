
-- Create the manual_readings table with proper references and types

CREATE TABLE public.manual_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES stations(id),
  nozzle_id UUID NOT NULL REFERENCES nozzles(id),
  cumulative_volume NUMERIC NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (Optional) Add Row Level Security (RLS) so only authenticated users can access
ALTER TABLE public.manual_readings ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to SELECT, INSERT, UPDATE, DELETE their own station’s readings
-- You can customize this as needed.
CREATE POLICY "Authenticated users can view manual readings"
  ON public.manual_readings
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert manual readings"
  ON public.manual_readings
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update manual readings"
  ON public.manual_readings
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete manual readings"
  ON public.manual_readings
  FOR DELETE
  USING (auth.role() = 'authenticated');
