'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, Clock, User } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Feed', icon: Home },
  { href: '/chat', label: 'Chats', icon: MessageSquare },
  { href: '/history', label: 'History', icon: Clock },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="bottom-nav">
      <div className="max-w-[480px] mx-auto grid grid-cols-4 text-sm">
        {tabs.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`flex flex-col items-center justify-center py-2 ${path===href ? 'text-black' : 'text-gray-500'}`}>
            <Icon size={20} />
            <span className="text-[11px] mt-0.5">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
