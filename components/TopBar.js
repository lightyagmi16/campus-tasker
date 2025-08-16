'use client';
import Link from 'next/link';

export default function TopBar({ title='Campus Tasker' }) {
  return (
    <div className="header">
      <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">{title}</Link>
      </div>
    </div>
  );
}
