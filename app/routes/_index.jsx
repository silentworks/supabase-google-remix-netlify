import { useOutletContext } from '@remix-run/react';

export default function Index() {
  const { authRedirect, supabase, session } = useOutletContext();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: authRedirect,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main>
      <h1>Welcome to Remix</h1>
      {session ? (
        <button onClick={handleSignOut}>Sign out</button>
      ) : (
        <button onClick={handleSignIn}>Sign in with Google</button>
      )}
    </main>
  );
}
