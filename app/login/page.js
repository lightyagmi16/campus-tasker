async function signEmail() {
  if (!email) return alert('Enter email');
  setBusy(true);

  // Use env variable if available, otherwise fallback to current site
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback` }
  });

  setBusy(false);
  if (error) alert(error.message);
  else alert('Magic link sent. Check inbox.');
}
