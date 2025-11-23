import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // required for RLS
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const password_hash = await bcrypt.hash(password, 10)

    const { error: dbError } = await supabase
      .from('user')
      .insert({
        username,
        email,
        password_hash,
      })

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Register error:', err)

    const message =
      err instanceof Error ? err.message : 'Internal server error'

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
