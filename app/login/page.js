'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  async function signEmail() {
    if (!email) return alert('Enter email');
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${https://campus-tasker-754q.vercel.app/}/auth/callback` }
    });
    setBusy(false);
    if (error) alert(error.message); else alert('Magic link sent. Check inbox.');
  }

  return (
    <div className="container-app grid place-items-center">
      <div className="w-full px-6">
        <div className="mt-24 mb-6">
          <h1 className="text-3xl font-bold">Campus Tasker</h1>
          <p className="text-gray-500">Get help or help others on campus</p>
        </div>
        <input className="border w-full rounded-lg px-3 py-3 mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="w-full bg-blue-600 text-white rounded-lg py-3" onClick={signEmail} disabled={busy}>{busy ? 'Sending…' : 'Sign in with Email'}</button>
        <p className="text-xs text-gray-400 mt-3">By continuing you agree to the community rules.</p>
      </div>
    </div>
  );
}
