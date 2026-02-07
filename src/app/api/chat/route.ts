import { ToolLoopAgent, createAgentUIStreamResponse, gateway } from 'ai'
import { systemPrompt } from '@/lib/ai/system-prompt'
import { tools } from '@/lib/ai/tools'
import { saveMessage } from '@/lib/supabase/queries'

const sousChef = new ToolLoopAgent({
  id: 'sous-chef',
  model: gateway('google/gemini-2.5-flash'),
  instructions: systemPrompt,
  tools,
  providerOptions: {
    google: {
      thinkingConfig: { thinkingBudget: 4096 },
    },
  },
})

export async function POST(req: Request) {
  const { messages, conversationId } = await req.json()

  // Save the latest user message before streaming
  if (conversationId) {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'user') {
      await saveMessage(conversationId, 'user', lastMessage.parts)
    }
  }

  return createAgentUIStreamResponse({
    agent: sousChef,
    uiMessages: messages,
    onFinish: async ({ responseMessage }) => {
      if (conversationId && responseMessage) {
        await saveMessage(conversationId, 'assistant', responseMessage.parts)
      }
    },
  })
}
