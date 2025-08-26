
export interface ApiCredential {
  id: string;
  provider: string;
  apiKey: string;
  apiUrl?: string;
  modelName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChainOfThoughtQuery {
  id: string;
  query: string;
  signature: string;
  reasoningSteps?: ReasoningStep[];
  finalAnswer?: string;
  provider: string;
  model?: string;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReasoningStep {
  step: number;
  title: string;
  content: string;
  timestamp: string;
}

export interface DSPySignature {
  inputs: Record<string, string>;
  outputs: Record<string, string>;
  instructions?: string;
}

export interface ChainOfThoughtRequest {
  query: string;
  signature: string;
  provider: string;
  model?: string;
}

export interface ChainOfThoughtResponse {
  status: 'processing' | 'completed' | 'failed';
  step?: ReasoningStep;
  finalAnswer?: string;
  error?: string;
}
