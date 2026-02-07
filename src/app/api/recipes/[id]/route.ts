import { NextResponse } from 'next/server'
import { deleteSavedRecipe } from '@/lib/supabase/queries'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  await deleteSavedRecipe(id)
  return NextResponse.json({ ok: true })
}
