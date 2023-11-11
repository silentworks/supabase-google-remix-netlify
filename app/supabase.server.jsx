import { createCookie } from '@remix-run/node';
import { createServerClient, parse, serialize } from '@supabase/ssr';

export const supabaseServer = (request) => {
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
        console.log(`Inside SET: ${key}`)
        const ck = createCookie(key)
        headers.append('Set-Cookie', ck.serialize(value, options));
        // headers.append('Set-Cookie', serialize(key, value, options));
      },
      remove(key, options) {
        console.log(`Inside REMOVE: ${key}`)
        const ck = createCookie(key)
        headers.append('Set-Cookie', ck.serialize('', options));
        // headers.append('Set-Cookie', serialize(key, '', options));
      },
    },
  });

  return { supabaseClient, headers };
};
