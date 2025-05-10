-- Previously in the python app, sqlalchemy was enforcing these defaults
ALTER TABLE public.user ALTER COLUMN auth0_sub SET NOT NULL;
ALTER TABLE public.user ALTER COLUMN is_email_verified SET DEFAULT false;
ALTER TABLE public.user ALTER COLUMN is_active SET DEFAULT true;
ALTER TABLE public.user ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE public.user ALTER COLUMN last_login SET DEFAULT now();
ALTER TABLE public.user ALTER COLUMN login_count SET DEFAULT 1;
ALTER TABLE public.bookmark ALTER COLUMN date_added SET NOT NULL;
ALTER TABLE public.user_tag ALTER COLUMN owner_id SET NOT NULL;
