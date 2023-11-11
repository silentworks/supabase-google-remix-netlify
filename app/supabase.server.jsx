import { createCookie } from '@remix-run/node'
import { createServerClient, parse, serialize } from '@supabase/ssr';

const len = (str) => {
	let size = Buffer.from(str).length;
	return size;
};

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
      async set(key, value, options) {
        console.log(`Inside SET: ${key} ${len(value)}`)
        const ck = createCookie(key, options)
        headers.append('Set-Cookie', await ck.serialize(value));
      },
      async remove(key, options) {
        console.log(`Inside REMOVE: ${key}`)
        const ck = createCookie(key, options)
        headers.set('Set-Cookie', await ck.serialize(''));
        // headers.append('Set-Cookie', serialize(key, '', options));
      },
    },
  });

  return { supabaseClient, headers };
};
