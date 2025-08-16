-- RLS for public feed + authenticated posting
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Public can read tasks (anyone)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tasks' AND policyname='public_select_tasks'
  ) THEN
    CREATE POLICY "public_select_tasks" ON public.tasks
      FOR SELECT USING (true);
  END IF;
END $$;

-- Only authenticated users can INSERT, and must set creator = auth.uid()
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tasks' AND policyname='auth_insert_tasks'
  ) THEN
    CREATE POLICY "auth_insert_tasks" ON public.tasks
      FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = creator);
  END IF;
END $$;

-- Only creator or assigned helper can UPDATE
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tasks' AND policyname='update_tasks_by_owner_or_helper'
  ) THEN
    CREATE POLICY "update_tasks_by_owner_or_helper" ON public.tasks
      FOR UPDATE USING (
        creator = auth.uid()
        OR EXISTS (SELECT 1 FROM public.task_assignees ta WHERE ta.task_id = public.tasks.id AND ta.helper = auth.uid())
      );
  END IF;
END $$;

-- created_at default
ALTER TABLE public.tasks
  ALTER COLUMN created_at SET DEFAULT now();

-- Realtime (safe if already added)
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_assignees;
