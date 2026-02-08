import { NextResponse } from 'next/server'
import { getMessages, getSavedRecipeNames, deleteConversation } from '@/lib/supabase/queries'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const [messages, savedRecipeNames] = await Promise.all([
    getMessages(id),
    getSavedRecipeNames(id),
  ])
  return NextResponse.json({ messages, savedRecipeNames })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  await deleteConversation(id)
  return NextResponse.json({ success: true })
}
