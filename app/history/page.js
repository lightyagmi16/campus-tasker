'use client';
import { useEffect, useState } from 'react';
import Guard from '../../components/Guard';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';
import { supabase } from '../../lib/supabaseClient';
import TaskCard from '../../components/TaskCard';

export default function History() {
  const [mine, setMine] = useState([]);
  const [accepted, setAccepted] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user.id;

      const { data: myTasks } = await supabase.from('tasks').select('*').eq('creator', uid).order('created_at', { ascending: false });
      setMine(myTasks || []);

      const { data: ass } = await supabase.from('task_assignees').select('task_id').eq('helper', uid);
      const taskIds = (ass || []).map(a => a.task_id);
      if (taskIds.length) {
        const { data: accTasks } = await supabase.from('tasks').select('*').in('id', taskIds).order('created_at', { ascending: false });
        setAccepted(accTasks || []);
      } else {
        setAccepted([]);
      }
    };
    load();
  }, []);

  return (
    <Guard>
      <TopBar title="History" />
      <div className="px-4 py-3">
        <h3 className="font-semibold mb-2">Your Posted Tasks</h3>
        {mine.length === 0 && <div className="text-gray-500 mb-4">No tasks posted yet.</div>}
        {mine.map(t => <TaskCard key={t.id} task={t} />)}
        <h3 className="font-semibold mt-6 mb-2">Tasks You Accepted</h3>
        {accepted.length === 0 && <div className="text-gray-500">No accepted tasks yet.</div>}
        {accepted.map(t => <TaskCard key={t.id} task={t} />)}
      </div>
      <BottomNav />
    </Guard>
  );
}
