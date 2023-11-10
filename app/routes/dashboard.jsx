import { useOutletContext } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';

import { supabaseServer } from '../supabase.server';

export const loader = async ({ request }) => {
  const { supabaseClient, headers } = await supabaseServer(request);

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session) {
    throw redirect('/');
  }

  return json({
    headers,
  });
};

const Page = () => {
  const { supabase, user } = useOutletContext();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <button onClick={handleSignOut}>Sign out</button>
      {user ? (
        <div>
          <h2>User</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      ) : null}
    </main>
  );
};

export default Page;
