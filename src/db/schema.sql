CREATE TABLE public."user" (
      id UUID NOT NULL,
      full_name VARCHAR NULL,
      auth0_sub VARCHAR NOT NULL,
      email VARCHAR NULL,
      is_email_verified BOOL NULL DEFAULT false,
      is_active BOOL NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
      last_login TIMESTAMPTZ NULL DEFAULT now():::TIMESTAMPTZ,
      login_count INT8 NULL DEFAULT 1:::INT8,
      misc_data JSONB NULL,
      CONSTRAINT user_pkey PRIMARY KEY (id ASC),
      UNIQUE INDEX ix_user_email (email ASC),
      INDEX ix_user_auth0_sub (auth0_sub ASC),
      INDEX ix_user_full_name (full_name ASC)
  );
  CREATE TABLE public.bookmark (
      id UUID NOT NULL,
      title VARCHAR NULL,
      url VARCHAR NOT NULL,
      date_added TIMESTAMPTZ NOT NULL,
      site VARCHAR NULL,
      owner_id UUID NOT NULL,
      search TSVECTOR NULL,
      CONSTRAINT bookmark_pkey PRIMARY KEY (id ASC),
      INDEX owner_id_bookmark_id_index (owner_id ASC, id ASC),
      INDEX owner_id_url_index (owner_id ASC, md5(url) ASC),
      INDEX owner_id_date_added_index (owner_id ASC, date_added ASC),
      INVERTED INDEX bookmarks_search_index (search),
      INDEX owner_id_site_index (owner_id ASC, site ASC) STORING (title, url, date_added)
  );
  CREATE TABLE public.user_tag (
      id UUID NOT NULL,
      name VARCHAR NOT NULL,
      display_name VARCHAR NOT NULL,
      owner_id UUID NOT NULL,
      CONSTRAINT user_tag_pkey PRIMARY KEY (id ASC),
      UNIQUE INDEX unique_owner_id_name (owner_id ASC, name ASC)
  );
  CREATE TABLE public.bookmark_tags (
      bookmark_id UUID NOT NULL,
      tag_id UUID NOT NULL,
      CONSTRAINT bookmark_tags_pkey PRIMARY KEY (bookmark_id ASC, tag_id ASC),
      INDEX ix_bookmark_tags_tag_id (tag_id ASC)
  );
  ALTER TABLE public.bookmark ADD CONSTRAINT bookmark_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public."user"(id);
  ALTER TABLE public.user_tag ADD CONSTRAINT user_tag_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public."user"(id);
  ALTER TABLE public.bookmark_tags ADD CONSTRAINT bookmark_tags_bookmark_id_fkey FOREIGN KEY (bookmark_id) REFERENCES public.bookmark(id);
  ALTER TABLE public.bookmark_tags ADD CONSTRAINT bookmark_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.user_tag(id);
  -- Validate foreign key constraints. These can fail if there was unvalidated data during the SHOW CREATE ALL TABLES
  ALTER TABLE public.bookmark VALIDATE CONSTRAINT bookmark_owner_id_fkey;
  ALTER TABLE public.user_tag VALIDATE CONSTRAINT user_tag_owner_id_fkey;
  ALTER TABLE public.bookmark_tags VALIDATE CONSTRAINT bookmark_tags_bookmark_id_fkey;
  ALTER TABLE public.bookmark_tags VALIDATE CONSTRAINT bookmark_tags_tag_id_fkey;
