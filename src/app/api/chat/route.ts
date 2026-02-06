import { ToolLoopAgent, createAgentUIStreamResponse, gateway } from 'ai'
import { systemPrompt } from '@/lib/ai/system-prompt'
import { tools } from '@/lib/ai/tools'

const sousChef = new ToolLoopAgent({
  id: 'sous-chef',
  model: gateway('openai/gpt-5-nano'),
  instructions: systemPrompt,
  tools,
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  return createAgentUIStreamResponse({
    agent: sousChef,
    uiMessages: messages,
  })
}
