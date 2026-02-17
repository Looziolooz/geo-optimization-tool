import { AIProviderName, AIProviderResponse } from '@/lib/types';

// ─── Base Provider ───────────────────────────────────────────
export abstract class BaseAIProvider {
  abstract name: AIProviderName;
  abstract displayName: string;
  abstract isConfigured(): boolean;
  abstract query(prompt: string): Promise<AIProviderResponse>;

  protected createResponse(
    content: string,
    responseTimeMs: number,
    extras?: Partial<AIProviderResponse>
  ): AIProviderResponse {
    return { provider: this.name, content, responseTimeMs, ...extras };
  }

  protected createErrorResponse(error: string, responseTimeMs: number): AIProviderResponse {
    return { provider: this.name, content: '', responseTimeMs, error };
  }
}

// ─── Google Gemini Provider (FREE — Primary) ─────────────────
export class GoogleGeminiProvider extends BaseAIProvider {
  name: AIProviderName = 'google-gemini';
  displayName = 'Google Gemini';

  isConfigured(): boolean {
    return !!(process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY);
  }

  async query(prompt: string): Promise<AIProviderResponse> {
    const start = Date.now();

    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const apiKey = (process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY)!;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const content = response.text();

      return this.createResponse(content, Date.now() - start);
    } catch (error) {
      return this.createErrorResponse(
        error instanceof Error ? error.message : 'Google Gemini query failed',
        Date.now() - start
      );
    }
  }
}

// ─── OpenRouter Provider (FREE — simula ChatGPT/GPT) ────────
// Usa Llama 3.3 70B (free) come sostituto di ChatGPT/Azure OpenAI
export class OpenRouterChatGPTProvider extends BaseAIProvider {
  name: AIProviderName = 'openrouter-chatgpt';
  displayName = 'ChatGPT (via OpenRouter)';

  isConfigured(): boolean {
    return !!process.env.OPENROUTER_API_KEY;
  }

  async query(prompt: string): Promise<AIProviderResponse> {
    const start = Date.now();

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'GEO Optimization Tool',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful AI search assistant similar to ChatGPT. Provide comprehensive, accurate answers with relevant details. If you mention specific brands, companies, or products, be factual and objective.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`OpenRouter API error: ${res.status} — ${errorBody}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      const tokensUsed = data.usage?.total_tokens;

      return this.createResponse(content, Date.now() - start, { tokensUsed });
    } catch (error) {
      return this.createErrorResponse(
        error instanceof Error ? error.message : 'OpenRouter ChatGPT query failed',
        Date.now() - start
      );
    }
  }
}

// ─── OpenRouter Provider (FREE — simula Perplexity) ──────────
// Usa DeepSeek V3 (free) come sostituto di Perplexity
export class OpenRouterPerplexityProvider extends BaseAIProvider {
  name: AIProviderName = 'openrouter-perplexity';
  displayName = 'Perplexity (via OpenRouter)';

  isConfigured(): boolean {
    return !!process.env.OPENROUTER_API_KEY;
  }

  async query(prompt: string): Promise<AIProviderResponse> {
    const start = Date.now();

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'GEO Optimization Tool',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3-0324:free',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful AI search assistant similar to Perplexity. Provide comprehensive, research-oriented answers. Mention specific brands, companies, and products when relevant. Be factual and cite sources when possible.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`OpenRouter API error: ${res.status} — ${errorBody}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      const tokensUsed = data.usage?.total_tokens;

      return this.createResponse(content, Date.now() - start, { tokensUsed });
    } catch (error) {
      return this.createErrorResponse(
        error instanceof Error ? error.message : 'OpenRouter Perplexity query failed',
        Date.now() - start
      );
    }
  }
}
