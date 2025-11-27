import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'

// service role key is required to insert user metadata securely
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      )
    }

    // create Supabase auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      })

    if (authError || !authData?.user) {
      return NextResponse.json(
        { error: authError?.message ?? 'Auth error' },
        { status: 400 }
      )
    }

    // insert into public.user respecting RLS
    const userId = authData.user.id
    const password_hash = await bcrypt.hash(password, 10)

    const { error: dbError } = await supabase
      .from('user')
      .insert({
        id: userId,
        username,
        email,
        password_hash
      })

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Internal server error'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
