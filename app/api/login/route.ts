import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'

// IMPORTANT — service role can read/compare credentials,
// but WILL NOT be exposed to the browser.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      )
    }

    const { data: userRow, error: fetchError } = await supabaseAdmin
      .from('user')
      .select('*')
      .eq('email', email)
      .single()

    if (fetchError || !userRow) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      )
    }

    const match = await bcrypt.compare(password, userRow.password_hash)

    if (!match) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { persistSession: false } // since API route, not browser
      }
    )

    const { data: sessionData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Return proper session cookies
    const response = NextResponse.json({ success: true })
    response.cookies.set({
      name: 'sb-access-token',
      value: sessionData.session!.access_token,
      httpOnly: true,
      path: '/'
    })
    response.cookies.set({
      name: 'sb-refresh-token',
      value: sessionData.session!.refresh_token,
      httpOnly: true,
      path: '/'
    })

    return response
  } catch (err: unknown) {
    console.error('Login error:', err)
    const message =
      err instanceof Error ? err.message : 'Internal server error'

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
