
import { NextRequest, NextResponse } from 'next/server';
import { getMaskedCredentials, addCredential } from '@/lib/credentials-store';

export async function GET() {
  try {
    const sanitized = getMaskedCredentials();
    return NextResponse.json({ success: true, data: sanitized });
  } catch (error) {
    console.error('Error fetching credentials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch credentials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, apiKey, apiUrl, modelName } = body;

    if (!provider || !apiKey) {
      return NextResponse.json(
        { success: false, error: 'Provider and API key are required' },
        { status: 400 }
      );
    }

    // Test connection before saving
    const testResult = await testApiConnection({ provider, apiKey, apiUrl, modelName });
    
    if (!testResult?.success) {
      return NextResponse.json(
        { success: false, error: testResult?.error ?? 'Failed to test API connection' },
        { status: 400 }
      );
    }

    // Create new credential object
    const credential = {
      id: Date.now().toString(), // Simple ID generation
      provider,
      apiKey,
      apiUrl,
      modelName,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to store
    addCredential(credential);

    return NextResponse.json({ 
      success: true, 
      data: {
        ...credential,
        apiKey: `****${credential?.apiKey?.slice?.(-4) ?? ''}`,
      }
    });
  } catch (error) {
    console.error('Error saving credentials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save credentials' },
      { status: 500 }
    );
  }
}

async function testApiConnection(params: {
  provider: string;
  apiKey: string;
  apiUrl?: string;
  modelName?: string;
}) {
  const { provider, apiKey, apiUrl, modelName } = params;

  try {
    let endpoint = '';
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    let testPayload: any = {};

    switch (provider) {
      case 'openai':
        endpoint = 'https://api.openai.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
        testPayload = {
          model: modelName || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 5,
        };
        break;
      case 'anthropic':
        endpoint = 'https://api.anthropic.com/v1/messages';
        headers['Authorization'] = `Bearer ${apiKey}`;
        headers['anthropic-version'] = '2023-06-01';
        testPayload = {
          model: modelName || 'claude-3-sonnet-20240229',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 5,
        };
        break;
      case 'custom':
        if (!apiUrl) {
          return { success: false, error: 'API URL is required for custom provider' };
        }
        endpoint = apiUrl;
        headers['Authorization'] = `Bearer ${apiKey}`;
        testPayload = {
          model: modelName || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 5,
        };
        break;
      default:
        return { success: false, error: `Unsupported provider: ${provider}` };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(testPayload),
    });

    if (response?.ok) {
      return { success: true };
    } else {
      const error = await response?.text?.() ?? 'Unknown error';
      return { success: false, error: `API test failed: ${error}` };
    }
  } catch (error) {
    return { 
      success: false, 
      error: `Connection test failed: ${error instanceof Error ? error?.message : 'Unknown error'}` 
    };
  }
}
