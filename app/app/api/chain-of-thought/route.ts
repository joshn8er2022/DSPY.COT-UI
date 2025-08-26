
import { NextRequest, NextResponse } from 'next/server';
import { getFullCredentials } from '@/lib/credentials-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, signature, provider, model } = body;

    if (!query || !signature || !provider) {
      return NextResponse.json(
        { success: false, error: 'Query, signature, and provider are required' },
        { status: 400 }
      );
    }

    // Get API credentials with full keys for internal use
    const allCredentials = getFullCredentials();
    const credentials = allCredentials.find((cred: any) => cred.provider === provider);

    if (!credentials) {
      return NextResponse.json(
        { success: false, error: `No active credentials found for provider: ${provider}` },
        { status: 400 }
      );
    }

    // Generate streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          // Process the chain of thought reasoning
          const reasoningSteps = await processChainOfThought({
            query,
            signature,
            credentials,
            model: model || credentials?.modelName,
          });
          
          // Stream reasoning steps
          for (let i = 0; i < reasoningSteps?.length ?? 0; i++) {
            const step = reasoningSteps?.[i];
            if (step) {
              const stepData = JSON.stringify({
                status: 'processing',
                step: {
                  step: i + 1,
                  title: step?.title ?? `Step ${i + 1}`,
                  content: step?.content ?? '',
                  timestamp: new Date().toISOString(),
                },
              });
              controller.enqueue(encoder.encode(`data: ${stepData}\n\n`));
              
              // Add delay to simulate real-time processing
              await new Promise(resolve => setTimeout(resolve, 1500));
            }
          }

          // Generate final answer
          const finalAnswer = await generateFinalAnswer({
            query,
            signature,
            reasoningSteps: reasoningSteps ?? [],
            credentials,
            model: model || credentials?.modelName,
          });

          // Stream final result
          const finalData = JSON.stringify({
            status: 'completed',
            finalAnswer,
          });
          controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
          
        } catch (error) {
          console.error('Chain of thought processing error:', error);

          const errorData = JSON.stringify({
            status: 'failed',
            error: error instanceof Error ? error?.message : 'Processing failed',
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chain of thought API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process chain of thought' },
      { status: 500 }
    );
  }
}

async function processChainOfThought(params: {
  query: string;
  signature: string;
  credentials: any;
  model?: string;
}) {
  const { query, signature, credentials, model } = params;

  // Parse DSPy-style signature (e.g., "question -> reasoning, answer")
  const [inputs, outputs] = signature?.split?.('->') ?? ['', ''];
  const inputFields = inputs?.split?.(',')?.map?.(f => f?.trim?.()) ?? [];
  const outputFields = outputs?.split?.(',')?.map?.(f => f?.trim?.()) ?? [];

  // Create chain of thought prompt inspired by DSPy methodology
  const chainOfThoughtPrompt = `
You are a DSPy Chain of Thought reasoning system. Break down the following problem into logical steps.

Signature: ${signature}
Query: ${query}

Please think through this step by step, providing clear reasoning for each step. Structure your response as a series of reasoning steps, each building on the previous ones.

For each step, provide:
1. A clear title describing what you're analyzing
2. Detailed reasoning and analysis
3. Any intermediate conclusions

Think carefully and methodically through the problem before providing your final answer.
`;

  try {
    const steps = [];
    
    // Step 1: Problem Understanding
    steps.push({
      title: "Problem Understanding",
      content: `Analyzing the query: "${query}" using signature pattern: ${signature}. The task requires ${outputFields?.length ?? 0} output(s): ${outputFields?.join?.(', ') ?? 'none'}.`
    });

    // Step 2: Information Gathering  
    steps.push({
      title: "Information Gathering",
      content: `Breaking down the input components and identifying key information needed to address: ${inputFields?.join?.(', ') ?? 'none'}.`
    });

    // Step 3: Reasoning Process
    const response = await callLLMAPI({
      prompt: chainOfThoughtPrompt,
      credentials,
      model,
    });

    if (response) {
      // Parse the response to extract reasoning steps
      const reasoningContent = response?.split?.('\n')?.filter?.((line: string) => line?.trim?.()) ?? [];
      let currentStep = 2;
      
      for (const line of reasoningContent) {
        if (line?.trim?.() && currentStep < 6) { // Limit to 6 steps total
          currentStep++;
          steps.push({
            title: `Reasoning Step ${currentStep - 2}`,
            content: line?.trim?.() ?? '',
          });
        }
      }
    }

    return steps;
  } catch (error) {
    console.error('Error processing chain of thought:', error);
    return [
      {
        title: "Error in Processing",
        content: `Failed to generate reasoning steps: ${error instanceof Error ? error?.message : 'Unknown error'}`
      }
    ];
  }
}

async function generateFinalAnswer(params: {
  query: string;
  signature: string;
  reasoningSteps: any[];
  credentials: any;
  model?: string;
}) {
  const { query, signature, reasoningSteps, credentials, model } = params;

  const finalPrompt = `
Based on the following chain of thought reasoning, provide a clear and concise final answer.

Original Query: ${query}
Signature: ${signature}

Reasoning Steps:
${reasoningSteps?.map?.((step, i) => `${i + 1}. ${step?.title}: ${step?.content}`)?.join?.('\n') ?? ''}

Now provide a direct, well-reasoned final answer to the original query:
`;

  try {
    const finalAnswer = await callLLMAPI({
      prompt: finalPrompt,
      credentials,
      model,
    });

    return finalAnswer || 'Unable to generate final answer';
  } catch (error) {
    console.error('Error generating final answer:', error);
    return `Error generating final answer: ${error instanceof Error ? error?.message : 'Unknown error'}`;
  }
}

async function callLLMAPI(params: {
  prompt: string;
  credentials: any;
  model?: string;
}) {
  const { prompt, credentials, model } = params;

  try {
    let endpoint = '';
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    let payload: any = {};

    switch (credentials?.provider) {
      case 'openai':
        endpoint = 'https://api.openai.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${credentials?.apiKey}`;
        payload = {
          model: model || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.7,
        };
        break;
      case 'anthropic':
        endpoint = 'https://api.anthropic.com/v1/messages';
        headers['Authorization'] = `Bearer ${credentials?.apiKey}`;
        headers['anthropic-version'] = '2023-06-01';
        payload = {
          model: model || 'claude-3-sonnet-20240229',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
        };
        break;
      case 'custom':
        endpoint = credentials?.apiUrl || '';
        headers['Authorization'] = `Bearer ${credentials?.apiKey}`;
        payload = {
          model: model || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.7,
        };
        break;
      default:
        throw new Error(`Unsupported provider: ${credentials?.provider}`);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (response?.ok) {
      const data = await response?.json?.();
      
      if (credentials?.provider === 'anthropic') {
        return data?.content?.[0]?.text ?? '';
      } else {
        return data?.choices?.[0]?.message?.content ?? '';
      }
    } else {
      const error = await response?.text?.() ?? 'Unknown error';
      throw new Error(`API call failed: ${error}`);
    }
  } catch (error) {
    console.error('LLM API call error:', error);
    throw error;
  }
}
