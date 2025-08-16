'use client';
import Guard from '../../components/Guard';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';
import ProfileForm from '../../components/ProfileForm';
import { supabase } from '../../lib/supabaseClient';

export default function Profile() {
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <Guard>
      <TopBar title="Profile" />
      <div className="px-4 py-3">
        <ProfileForm />
        <button onClick={logout} className="w-full border rounded-lg py-3 mt-4">Logout</button>
      </div>
      <BottomNav />
    </Guard>
  );
}
