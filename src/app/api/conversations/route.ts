import { NextResponse } from 'next/server'
import { createConversation, listConversations } from '@/lib/supabase/queries'

export async function GET() {
  const conversations = await listConversations()
  return NextResponse.json(conversations)
}

export async function POST(req: Request) {
  const { title } = await req.json()
  const conversation = await createConversation(title)
  return NextResponse.json(conversation)
}
