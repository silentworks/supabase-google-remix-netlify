import { redirect } from '@remix-run/node';
import { supabaseServer } from '../supabase.server';

export const loader = async ({ request }) => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const { supabaseClient, headers } = supabaseServer(request)
    const { error } = await supabaseClient.auth.exchangeCodeForSession(code);

    if (!error) {
      requestUrl.searchParams.delete('code');
      return redirect(next, { headers });
    }
  }
  return redirect('/auth/error', { headers });
};
