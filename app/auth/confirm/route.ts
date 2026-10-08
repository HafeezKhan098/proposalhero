import { createClient } from '@/supabase/server';
import { NextResponse } from 'next/server';
export async function GET(request:Request){const url=new URL(request.url);const token_hash=url.searchParams.get('token_hash');const type=url.searchParams.get('type');const next=url.searchParams.get('next')||'/dashboard';if(token_hash&&type){const supabase=await createClient();const {error}=await supabase.auth.verifyOtp({type: type as 'email',token_hash});if(!error)return NextResponse.redirect(new URL(next,url.origin));}return NextResponse.redirect(new URL('/login?error=confirmation',url.origin))}
