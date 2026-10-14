import { createClient } from '@/supabase/server';
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // 303 so the browser follows with GET instead of re-POSTing to "/".
  return NextResponse.redirect(new URL('/', request.url), 303);
}
