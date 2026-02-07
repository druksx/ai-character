'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { ConversationRow } from '@/lib/supabase/types'

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/conversations')
      if (!res.ok) throw new Error('Failed to load conversations')
      const data = await res.json()
      setConversations(data)
    } catch {
      toast.error('Could not load conversations')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const create = useCallback(async (title: string): Promise<string> => {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    if (!res.ok) throw new Error('Failed to create conversation')
    const conversation: ConversationRow = await res.json()
    setConversations(prev => [conversation, ...prev])
    return conversation.id
  }, [])

  const remove = useCallback(async (id: string) => {
    const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Could not delete conversation')
      return
    }
    setConversations(prev => prev.filter(c => c.id !== id))
    toast.success('Conversation deleted')
  }, [])

  const updateTitle = useCallback((id: string, title: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, title } : c)),
    )
  }, [])

  return { conversations, isLoading, refresh, create, remove, updateTitle }
}
