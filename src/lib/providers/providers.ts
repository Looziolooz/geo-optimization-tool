import { AIProviderName, AIProviderResponse } from '@/lib/types';

export abstract class BaseAIProvider {
  abstract name: AIProviderName;
  abstract displayName: string;
  abstract isConfigured(): boolean;
  abstract query(prompt: string): Promise<AIProviderResponse>;

  protected ok(content: string, ms: number, extras?: Partial<AIProviderResponse>): AIProviderResponse {
    return { provider: this.name, content, responseTimeMs: ms, ...extras };
  }
  protected fail(error: string, ms: number): AIProviderResponse {
    return { provider: this.name, content: '', responseTimeMs: ms, error };
  }
}

export class GoogleGeminiProvider extends BaseAIProvider {
  name: AIProviderName = 'google-gemini';
  displayName = 'Google Gemini';

  isConfigured() { return !!(process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY); }

  async query(prompt: string): Promise<AIProviderResponse> {
    const t = Date.now();
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const key = (process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY)!;
      const model = new GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });
      const result = await model.generateContent(prompt);
      return this.ok(result.response.text(), Date.now() - t);
    } catch (e) {
      return this.fail(e instanceof Error ? e.message : 'Gemini failed', Date.now() - t);
    }
  }
}

export class OpenRouterChatGPTProvider extends BaseAIProvider {
  name: AIProviderName = 'openrouter-chatgpt';
  displayName = 'ChatGPT (via OpenRouter)';

  isConfigured() { return !!process.env.OPENROUTER_API_KEY; }

  async query(prompt: string): Promise<AIProviderResponse> {
    return this._query(prompt, 'meta-llama/llama-3.3-70b-instruct:free',
      'You are ChatGPT, a helpful AI search assistant. Provide comprehensive, accurate answers. Mention specific brands and companies when relevant. Be factual and objective.');
  }

  protected async _query(prompt: string, model: string, system: string): Promise<AIProviderResponse> {
    const t = Date.now();
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'GEO Tool',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });
      if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
      const data = await res.json();
      return this.ok(data.choices?.[0]?.message?.content || '', Date.now() - t, { tokensUsed: data.usage?.total_tokens });
    } catch (e) {
      return this.fail(e instanceof Error ? e.message : 'OpenRouter failed', Date.now() - t);
    }
  }
}

export class OpenRouterPerplexityProvider extends OpenRouterChatGPTProvider {
  name: AIProviderName = 'openrouter-perplexity';
  displayName = 'Perplexity (via OpenRouter)';

  async query(prompt: string): Promise<AIProviderResponse> {
    return this._query(prompt, 'deepseek/deepseek-chat-v3-0324:free',
      'You are Perplexity, an AI search engine. Provide research-oriented answers with specific brand names, product recommendations, and factual comparisons. Cite sources when possible.');
  }
}
