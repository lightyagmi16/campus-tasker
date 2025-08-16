'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Guard from '../../components/Guard';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';
import Link from 'next/link';

export default function ChatList() {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user.id;
      const { data: mine } = await supabase.from('tasks').select('*').eq('creator', uid);
      const { data: ass } = await supabase.from('task_assignees').select('task_id').eq('helper', uid);
      const ids = new Set([...(mine||[]).map(t=>t.id), ...(ass||[]).map(a=>a.task_id)]);
      if (ids.size === 0) return setThreads([]);
      const { data: tasks } = await supabase.from('tasks').select('*').in('id', Array.from(ids)).order('created_at', { ascending: false });
      setThreads(tasks || []);
    };
    load();
  }, []);

  return (
    <Guard>
      <TopBar title="Chats" />
      <div className="px-4 py-3">
        {threads.length === 0 && <div className="text-gray-500">No chats yet.</div>}
        {threads.map(t => (
          <Link key={t.id} href={`/chat/${t.id}`} className="block border rounded-xl p-4 mb-3 hover:bg-gray-50">
            <div className="font-medium">{t.title}</div>
            <div className="text-sm text-gray-500">Tap to open chat</div>
          </Link>
        ))}
      </div>
      <BottomNav />
    </Guard>
  );
}
