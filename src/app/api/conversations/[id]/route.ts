import { NextResponse } from 'next/server'
import { getMessages, deleteConversation } from '@/lib/supabase/queries'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const messages = await getMessages(id)
  return NextResponse.json(messages)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  await deleteConversation(id)
  return NextResponse.json({ success: true })
}
