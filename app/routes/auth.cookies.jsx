import { redirect, createCookie } from '@remix-run/node';
import { serialize } from '@supabase/ssr';

export const loader = async ({ request }) => {
  const responseHeaders = new Headers();
  const chunks = ['hello-world.and.more.to.come', 'there.will.be.more']
  chunks.forEach(async (chunk, i) => {
    responseHeaders.append('Set-Cookie', serialize(`my-cookie.${i}`, chunk, {
      sameSite: "lax",
      maxAge: 604_800
    }));
  })
  console.log({ ...Object.fromEntries(responseHeaders) })
  return redirect('/', { 
    headers: {
      ...Object.fromEntries(responseHeaders)
    }
  });
};
