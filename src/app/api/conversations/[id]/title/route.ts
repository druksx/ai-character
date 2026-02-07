import { NextResponse } from 'next/server'
import { generateText, gateway } from 'ai'
import { updateConversationTitle } from '@/lib/supabase/queries'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const { message } = await req.json()

  const { text } = await generateText({
    model: gateway('google/gemini-2.5-flash'),
    prompt: `Generate a short conversation title (3-6 words max, no quotes, no punctuation) for a cooking chat that started with: "${message}"`,
  })

  const title = text.trim().replace(/^["']|["']$/g, '')
  if (title) {
    await updateConversationTitle(id, title)
  }

  return NextResponse.json({ title })
}
