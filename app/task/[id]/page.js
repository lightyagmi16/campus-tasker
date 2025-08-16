'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import Guard from '../../../components/Guard';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';

export default function TaskDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);

    useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('tasks').select('*').eq('id', id).single();
      setTask(data);
    };
    load();
    const ch = supabase.channel(`task-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `id=eq.${id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id]);

  async function acceptTask() {
    const { data: u } = await supabase.auth.getUser();
    const { error: e1 } = await supabase.from('task_assignees').insert({ task_id: Number(id), helper: u.user.id });
    if (e1) return alert(e1.message);
    const { error: e2 } = await supabase.from('tasks').update({ status: 'assigned' }).eq('id', id);
    if (e2) return alert(e2.message);
    router.push(`/chat/${id}`);
  }

  if (!task) return <div className="container-app p-6">Loading…</div>;

  return (
    <Guard>
      <TopBar title="Task" />
      <div className="px-4 py-3 space-y-3">
        <h2 className="text-xl font-bold">{task.title}</h2>
        <div className="text-gray-600">📍 {task.location}</div>
        <div>Tip: <span className="text-blue-600 font-semibold">Rs. {task.tip_amount}</span></div>
        <p className="text-gray-700">{task.description}</p>
        <div className="text-sm text-gray-400">Status: {task.status}</div>
        {task.status === 'open' && <button onClick={acceptTask} className="w-full bg-blue-600 text-white rounded-lg py-3">Accept Task</button>}
        <button onClick={() => router.push(`/chat/${id}`)} className="w-full border rounded-lg py-3">Open Chat</button>
      </div>
      <BottomNav />
    </Guard>
  );
}
