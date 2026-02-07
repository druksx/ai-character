import type { UIMessage, InferUITools } from 'ai'
import type { tools } from './tools'

type SousChefTools = InferUITools<typeof tools>
export type SousChefMessage = UIMessage<unknown, never, SousChefTools>
