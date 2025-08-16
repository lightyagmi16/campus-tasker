'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import Guard from '../../../components/Guard';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';

export default function Chat() {
  const { taskId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    const load = async () => {
      const { data } = await supabase.from('task_messages').select('*').eq('task_id', taskId).order('created_at');
      setMessages(data || []);
    };
    load();
    const ch = supabase.channel(`chat-${taskId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'task_messages', filter: `task_id=eq.${taskId}` },
        payload => setMessages(prev => [...prev, payload.new]))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [taskId]);

  async function send() {
    if (!text.trim()) return;
    const { data: u } = await supabase.auth.getUser();
    await supabase.from('task_messages').insert({ task_id: Number(taskId), sender: u.user.id, message: text.trim() });
    setText('');
  }

  return (
    <Guard>
      <TopBar title="Chat" />
      <div className="px-4 pt-3 pb-24 min-h-screen">
        <div className="space-y-2">
          {messages.map(m => (
            <div key={m.id} className={`max-w-[75%] px-3 py-2 rounded-2xl ${m.sender === user?.id ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100'}`}>
              {m.message}
            </div>
          ))}
        </div>
      </div>
      <div className="bottom-nav border-t">
        <div className="max-w-[480px] mx-auto p-3 flex gap-2">
          <input className="border rounded-lg px-3 py-2 flex-1" value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." />
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white" onClick={send}>Send</button>
        </div>
      </div>
      <BottomNav />
    </Guard>
  );
}
