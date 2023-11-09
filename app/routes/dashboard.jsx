import { useOutletContext } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import { createServerClient, parse, serialize } from '@supabase/ssr';

export const loader = async ({ request }) => {
  const cookies = parse(request.headers.get('Cookie') ?? '');
  const headers = new Headers();

  const supabaseClient = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    cookies: {
      get(key) {
        return cookies[key];
      },
      set(key, value, options) {
        headers.append('Set-Cookie', serialize(key, value, options));
      },
      remove(key, options) {
        headers.append('Set-Cookie', serialize(key, '', options));
      },
    },
  });

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!session) {
    throw redirect('/');
  }

  return json(
    {
      user,
    },
    {
      headers,
    }
  );
};

const Page = () => {
  const { supabase } = useOutletContext();
  const { user } = useLoaderData();

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
