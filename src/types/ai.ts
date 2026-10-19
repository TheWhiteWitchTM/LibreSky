export type AIProvider = 'ollama' | 'lmstudio' | 'localai' | 'custom';

export type AIDetectionStatus = 'checking' | 'connected' | 'disconnected';

export interface AIModel {
  id: string;
  name: string;
  size?: string;
  modifiedAt?: string;
  family?: string;
  parameterSize?: string;
}

export interface AIProviderConfig {
  provider: AIProvider;
  endpoint: string;
  selectedModel: string;
  temperature: number;
  systemPrompt?: string;
  isCustom: boolean;
}

export type GrokActionMode =
  | 'explain'
  | 'factcheck'
  | 'summarize'
  | 'reply'
  | 'roast'
  | 'translate'
  | 'freeform';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
