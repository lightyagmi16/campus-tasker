'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import TaskCard from '../components/TaskCard';
import Link from 'next/link';

export default function FeedPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && mounted) setTasks(data || []);
    }
    load();

    const channel = supabase.channel('public:tasks')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, (payload) => {
        setTasks(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="container-app">
      <TopBar title="Campus Tasker" />
      <div className="px-4 py-3">
        {tasks.length === 0 && <div className="text-gray-500">No tasks yet. Be the first to post!</div>}
        {tasks.map(t => <TaskCard key={t.id} task={t} />)}
      </div>
      <Link href="/post" className="fab">＋</Link>
      <BottomNav />
    </div>
  );
}
