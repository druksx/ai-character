'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ConversationRow } from '@/lib/supabase/types'

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/conversations')
      const data = await res.json()
      setConversations(data)
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
    const conversation: ConversationRow = await res.json()
    setConversations(prev => [conversation, ...prev])
    return conversation.id
  }, [])

  const remove = useCallback(async (id: string) => {
    await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
    setConversations(prev => prev.filter(c => c.id !== id))
  }, [])

  const updateTitle = useCallback((id: string, title: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, title } : c)),
    )
  }, [])

  return { conversations, isLoading, refresh, create, remove, updateTitle }
}
