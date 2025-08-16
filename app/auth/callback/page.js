'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'


export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Auth error:', error.message);
        return;
      }
      if (session) router.replace('/');
      else {
        const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) router.replace('/');
        });
        return () => sub.subscription.unsubscribe();
      }
    };
    run();
  }, [router]);

  return (
    <div className="container-app grid place-items-center">
      <div className="p-6">Logging you in…</div>
    </div>
  );
}
