import Link from 'next/link';

export default function TaskCard({ task }) {
  return (
    <Link href={`/task/${task.id}`} className="block border rounded-xl p-4 mb-3 hover:bg-gray-50">
      <div className="font-medium">{task.title}</div>
      <div className="text-sm text-gray-500">📍 {task.location}</div>
      <div className="text-blue-600 font-semibold">Tip: Rs. {task.tip_amount}</div>
      <div className="text-xs text-gray-400 mt-1">Status: {task.status}</div>
    </Link>
  );
}
