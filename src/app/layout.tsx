import { AIProviderName, AIProviderResponse } from '@/lib/types';

// ─── Base Provider ───────────────────────────────────────────
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

// ─── Google Gemini Provider (Utilizzo di Gemini 1.5 Flash) ───
export class GoogleGeminiProvider extends BaseAIProvider {
  name: AIProviderName = 'google-gemini';
  displayName = 'Google Gemini';

  isConfigured() { 
    return !!(process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY); 
  }

  async query(prompt: string): Promise<AIProviderResponse> {
    const t = Date.now();
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const key = (process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY)!;
      const genAI = new GoogleGenerativeAI(key);
      
      // Utilizziamo 'gemini-1.5-flash' che è l'identificativo standard attuale.
      // Se continui ad avere 404, prova a rimuovere 'models/' dal prefisso se aggiunto manualmente.
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.ok(text, Date.now() - t);
    } catch (e) {
      return this.fail(e instanceof Error ? e.message : 'Gemini failed', Date.now() - t);
    }
  }
}

// ─── OpenRouter ChatGPT Provider (Llama 3.3 70B) ──────────────
export class OpenRouterChatGPTProvider extends BaseAIProvider {
  name: AIProviderName = 'openrouter-chatgpt';
  displayName = 'ChatGPT (via OpenRouter)';

  isConfigured() { return !!process.env.OPENROUTER_API_KEY; }

  async query(prompt: string): Promise<AIProviderResponse> {
    // Puntiamo a Llama 3.3 70B Instruct, che è il modello di riferimento attuale.
    return this._query(prompt, 'meta-llama/llama-3.3-70b-instruct',
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
          'X-Title': 'GEO Optimization Tool',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: system }, 
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || `OpenRouter error: ${res.status}`);
      }
      
      const data = await res.json();
      return this.ok(data.choices?.[0]?.message?.content || '', Date.now() - t, { tokensUsed: data.usage?.total_tokens });
    } catch (e) {
      return this.fail(e instanceof Error ? e.message : 'OpenRouter failed', Date.now() - t);
    }
  }
}

// ─── OpenRouter Perplexity Provider (Gemini 2.0 Flash) ───────
export class OpenRouterPerplexityProvider extends OpenRouterChatGPTProvider {
  name: AIProviderName = 'openrouter-perplexity';
  displayName = 'Perplexity (via OpenRouter)';

  async query(prompt: string): Promise<AIProviderResponse> {
    // Sostituito l'endpoint errato con 'google/gemini-2.0-flash-001' 
    // che è la versione stabile di Gemini 2.0 su OpenRouter.
    return this._query(prompt, 'google/gemini-2.0-flash-001',
      'You are Perplexity, an AI search engine. Provide research-oriented answers with specific brand names, product recommendations, and factual comparisons. Cite sources when possible.');
  }
}