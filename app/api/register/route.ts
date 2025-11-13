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

    // hash password before storing
    const password_hash = await bcrypt.hash(password, 10)

    // insert into 'user'
    const { data, error } = await supabase
      .from('user')
      .insert([{ username, email, password_hash }])
      .select()

    if (error) throw error

    return NextResponse.json({ message: 'User registered successfully', user: data[0] })
  } catch (err: unknown) {
    console.error('Register error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message || 'Internal server error' }, { status: 500 })
  }
}
