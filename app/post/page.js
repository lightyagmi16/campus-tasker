'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Guard from '../../components/Guard';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';
import { useRouter } from 'next/navigation';

export default function PostTask() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [tip, setTip] = useState('');
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
  }, []);

  async function submit() {
    if (!title || !location) return alert('Title and location are required.');
    const tipAmount = Number(tip || 0);
    const { error } = await supabase.from('tasks').insert({
      creator: userId, title, description: desc, location, tip_amount: tipAmount, status: 'open'
    });
    if (error) return alert(error.message);
    router.replace('/');
  }

  return (
    <Guard>
      <TopBar title="New Task" />
      <div className="px-4 py-3 space-y-3">
        <input className="border rounded-lg px-3 py-3 w-full" placeholder="Task Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="border rounded-lg px-3 py-3 w-full" placeholder="Description" rows={4} value={desc} onChange={e=>setDesc(e.target.value)} />
        <input className="border rounded-lg px-3 py-3 w-full" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} />
        <input className="border rounded-lg px-3 py-3 w-full" placeholder="Tip Amount (Rs.)" value={tip} onChange={e=>setTip(e.target.value)} />
        <button className="w-full bg-blue-600 text-white rounded-lg py-3" onClick={submit}>Post Task</button>
      </div>
      <BottomNav />
    </Guard>
  );
}
