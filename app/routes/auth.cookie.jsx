import { redirect, createCookie } from '@remix-run/node';

export const loader = async ({ request }) => {
  const headers = new Headers();
  const chunks = ['hello-world.and.more.to.come', 'there.will.be.more']
  chunks.forEach(async (chunk, i) => {
    const cookie = createCookie(`my-cookie.${i}`, {
      sameSite: "lax"
    })
    headers.append('Set-Cookie', await cookie.serialize(chunk));
  })
    
  return redirect(next, { headers });
};
