-- ================================================================
-- VISION SOLAR FORM BUILDER — SUPABASE SQL SCHEMA (safe to re-run)
-- ================================================================

-- Drop tables in reverse order (children first) to avoid FK conflicts
DROP TABLE IF EXISTS public.submission_responses CASCADE;
DROP TABLE IF EXISTS public.form_submissions     CASCADE;
DROP TABLE IF EXISTS public.form_elements        CASCADE;
DROP TABLE IF EXISTS public.forms                CASCADE;

-- Drop the helper view too
DROP VIEW IF EXISTS public.v_submission_summary;

-- Helper function for auto-updating updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------
-- TABLE 1: forms
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forms (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                   TEXT NOT NULL DEFAULT 'Untitled Form',
  description             TEXT,
  created_by              UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_published            BOOLEAN NOT NULL DEFAULT false,
  access_type             TEXT NOT NULL DEFAULT 'public'
                            CHECK (access_type IN ('public','private','company')),
  require_registration    BOOLEAN NOT NULL DEFAULT false,
  allow_submission_access BOOLEAN NOT NULL DEFAULT true,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  views                   INTEGER NOT NULL DEFAULT 0
);

DROP TRIGGER IF EXISTS forms_updated_at ON public.forms;
CREATE TRIGGER forms_updated_at
  BEFORE UPDATE ON public.forms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------
-- TABLE 2: form_elements  (canvas fields, ordered)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.form_elements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id      UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  element_id   TEXT NOT NULL,
  element_type TEXT NOT NULL,
  custom_label TEXT,
  properties   JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_form_elements_form_id
  ON public.form_elements(form_id, sort_order);

-- ----------------------------------------------------------------
-- TABLE 3: form_submissions  (one row per response)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id         UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  submitted_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitter_email TEXT,
  ip_address      TEXT,
  user_agent      TEXT,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id
  ON public.form_submissions(form_id, submitted_at DESC);

-- ----------------------------------------------------------------
-- TABLE 4: submission_responses  (one row per field per response)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.submission_responses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id   UUID NOT NULL REFERENCES public.form_submissions(id) ON DELETE CASCADE,
  form_element_id TEXT,
  element_type    TEXT NOT NULL,
  field_label     TEXT,
  response_value  JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submission_responses_submission_id
  ON public.submission_responses(submission_id);

-- ----------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------
ALTER TABLE public.forms                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_elements        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_responses ENABLE ROW LEVEL SECURITY;

-- forms policies
DROP POLICY IF EXISTS "Public forms readable by all"  ON public.forms;
DROP POLICY IF EXISTS "Owners manage their forms"      ON public.forms;

CREATE POLICY "Public forms readable by all"
  ON public.forms FOR SELECT
  USING (is_published = true AND access_type = 'public');

CREATE POLICY "Owners manage their forms"
  ON public.forms FOR ALL
  USING  (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can delete forms"
  ON public.forms FOR DELETE
  USING (
    (auth.jwt() ->> 'role') = 'admin' 
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() ->> 'email') = 'admin@visionsolar.com'
  );

-- form_elements policies
DROP POLICY IF EXISTS "Elements readable with parent form" ON public.form_elements;
DROP POLICY IF EXISTS "Only owner can write elements"      ON public.form_elements;

CREATE POLICY "Elements readable with parent form"
  ON public.form_elements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.forms f
      WHERE f.id = form_id
        AND (f.is_published = true OR f.created_by = auth.uid())
    )
  );

CREATE POLICY "Only owner can write elements"
  ON public.form_elements FOR ALL
  USING      (EXISTS (SELECT 1 FROM public.forms f WHERE f.id = form_id AND f.created_by = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.forms f WHERE f.id = form_id AND f.created_by = auth.uid()));

-- form_submissions policies
DROP POLICY IF EXISTS "Anyone can submit to published form" ON public.form_submissions;
DROP POLICY IF EXISTS "Submitters read own submissions"     ON public.form_submissions;
DROP POLICY IF EXISTS "Form owners read all submissions"    ON public.form_submissions;

CREATE POLICY "Anyone can submit to published form"
  ON public.form_submissions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.forms f WHERE f.id = form_id AND f.is_published = true));

CREATE POLICY "Submitters read own submissions"
  ON public.form_submissions FOR SELECT
  USING (submitted_by = auth.uid());

CREATE POLICY "Form owners read all submissions"
  ON public.form_submissions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.forms f WHERE f.id = form_id AND f.created_by = auth.uid()));

-- submission_responses policies
DROP POLICY IF EXISTS "Allow insert with valid submission" ON public.submission_responses;
DROP POLICY IF EXISTS "Users read own responses"          ON public.submission_responses;
DROP POLICY IF EXISTS "Owners read all responses"         ON public.submission_responses;

CREATE POLICY "Allow insert with valid submission"
  ON public.submission_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.form_submissions s
      JOIN public.forms f ON f.id = s.form_id
      WHERE s.id = submission_id AND f.is_published = true
    )
  );

CREATE POLICY "Users read own responses"
  ON public.submission_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.form_submissions s
      WHERE s.id = submission_id AND s.submitted_by = auth.uid()
    )
  );

CREATE POLICY "Owners read all responses"
  ON public.submission_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.form_submissions s
      JOIN public.forms f ON f.id = s.form_id
      WHERE s.id = submission_id AND f.created_by = auth.uid()
    )
  );

-- ----------------------------------------------------------------
-- HELPER VIEW: submission summary for a responses dashboard
-- ----------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_submission_summary AS
SELECT
  fs.id              AS submission_id,
  fs.form_id,
  f.title            AS form_title,
  fs.submitted_at,
  fs.submitter_email,
  fs.submitted_by,
  COUNT(sr.id)       AS response_count
FROM public.form_submissions fs
JOIN public.forms f ON f.id = fs.form_id
LEFT JOIN public.submission_responses sr ON sr.submission_id = fs.id
GROUP BY fs.id, fs.form_id, f.title, fs.submitted_at, fs.submitter_email, fs.submitted_by;

-- ----------------------------------------------------------------
-- HELPER FUNCTION: increment form views
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_form_views(form_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.forms
  SET views = views + 1
  WHERE id = form_id;
END;
$$;
