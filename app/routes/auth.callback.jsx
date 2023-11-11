import { redirect } from '@remix-run/node';
import { createServerClient, parse, serialize } from '@supabase/ssr';

export const loader = async ({ request }) => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const cookies = parse(request.headers.get('Cookie') ?? '');
    const headers = new Headers();

    const supabaseClient = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production'
      },
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

    const { error } = await supabaseClient.auth.exchangeCodeForSession(code);

    if (!error) {
      requestUrl.searchParams.delete('code');
      return redirect(next, { headers });
    }
  }
  return redirect('/auth/error', { headers });
};
