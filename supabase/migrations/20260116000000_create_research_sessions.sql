-- 1. Create research_sessions table
CREATE TABLE public.research_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  context JSONB DEFAULT '{}'::jsonb,      -- Stores analysis result or plan
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.research_sessions ENABLE ROW LEVEL SECURITY;

-- 3. Set RLS Policies
CREATE POLICY "Users can view their own research sessions" 
ON public.research_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own research sessions" 
ON public.research_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own research sessions"
ON public.research_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own research sessions"
ON public.research_sessions FOR DELETE
USING (auth.uid() = user_id);

-- 4. Create performance index
CREATE INDEX idx_research_sessions_user_id_created_at 
ON public.research_sessions (user_id, created_at DESC);

-- 5. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_research_sessions_updated_at
BEFORE UPDATE ON public.research_sessions
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
