import { useEffect, useState } from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from '@remix-run/react';
import { json } from '@remix-run/node';

import { createBrowserClient } from '@supabase/ssr';
import { supabaseServer } from './supabase.server';

export const loader = async ({ request }) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_AUTH_REDIRECT: process.env.SUPABASE_AUTH_REDIRECT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  };

  const { supabaseClient, headers } = await supabaseServer(request);

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  return json(
    {
      env,
      session,
      user,
    },
    // {
    //   headers,
    // }
  );
};

export const meta = () => [
  {
    charset: 'utf-8',
    title: 'New Remix App',
    viewport: 'width=device-width,initial-scale=1',
  },
];

export default function App() {
  const { env, session, user } = useLoaderData();

  const authRedirect = env.SUPABASE_AUTH_REDIRECT;

  const { revalidate } = useRevalidator();

  const [supabase] = useState(() => createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY));

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        revalidate();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, supabase, revalidate]);

  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet context={{ authRedirect, supabase, session, user }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
