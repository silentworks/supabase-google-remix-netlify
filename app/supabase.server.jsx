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
        const randomString = Math.random().toString(36).slice(2, 7);
        console.log(`Inside SET: ${key} ${len(value)}`)
        headers.append('Set-Cookie', serialize(`${randomString}${key}`, value, options));
      },
      async remove(key, options) {
        console.log(`Inside REMOVE: ${key}`)
        headers.append('Set-Cookie', serialize(key, '', options));
      },
    },
  });

  return { supabaseClient, headers };
};
