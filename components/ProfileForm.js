'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ProfileForm() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const id = data.user?.id;
      if (!id) return;
      const { data: prof } = await supabase.from('user_profiles').select('*').eq('id', id).single();
      if (prof) setName(prof.full_name || '');
    });
  }, []);

  async function save() {
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    const id = u.user.id;
    const { error } = await supabase.from('user_profiles').upsert({ id, full_name: name });
    setLoading(false);
    if (error) alert(error.message); else alert('Saved');
  }

  return (
    <div className="p-4">
      <label className="block text-sm text-gray-600">Full name</label>
      <input className="border rounded-lg px-3 py-2 w-full mb-3" value={name} onChange={e=>setName(e.target.value)} />
      <button onClick={save} className="w-full bg-blue-600 text-white rounded-lg py-2" disabled={loading}>{loading ? 'Saving…' : 'Save'}</button>
    </div>
  );
}
