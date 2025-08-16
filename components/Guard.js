'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function Guard({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (!data.session) router.replace('/login');
      else setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace('/login');
      else setReady(true);
    });
    return () => { mounted = false; try { sub.subscription.unsubscribe(); } catch(e){} };
  }, [router]);

  if (!ready) return <div className="container-app p-6">Loading…</div>;
  return <div className="container-app">{children}</div>;
}
