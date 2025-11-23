import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()

  // clears the auth session cookie
  await supabase.auth.signOut()

  return NextResponse.json({ success: true })
}
