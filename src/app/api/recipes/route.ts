import { NextResponse } from 'next/server'
import { saveRecipe } from '@/lib/supabase/queries'

export async function POST(req: Request) {
  const { conversationId, recipe } = await req.json()
  const id = await saveRecipe(conversationId, recipe)
  return NextResponse.json({ id })
}
