import {
  GoogleGeminiProvider,
  OpenRouterChatGPTProvider,
  OpenRouterPerplexityProvider,
  BaseAIProvider,
} from './providers';
import { AIProviderName, AIProviderResponse } from '@/lib/types';

export class ProviderManager {
  private providers: BaseAIProvider[];
  private fallbackOrder: AIProviderName[];

  constructor() {
    this.providers = [
      new GoogleGeminiProvider(),
      new OpenRouterChatGPTProvider(),
      new OpenRouterPerplexityProvider(),
    ];

    // Fallback: Gemini → ChatGPT (Llama via OpenRouter) → Perplexity (DeepSeek via OpenRouter)
    this.fallbackOrder = ['google-gemini', 'openrouter-chatgpt', 'openrouter-perplexity'];
  }

  getAvailableProviders(): BaseAIProvider[] {
    return this.providers.filter((p) => p.isConfigured());
  }

  getProvider(name: AIProviderName): BaseAIProvider | undefined {
    return this.providers.find((p) => p.name === name && p.isConfigured());
  }

  /** Query with automatic fallback */
  async queryWithFallback(prompt: string): Promise<AIProviderResponse> {
    const errors: string[] = [];

    for (const providerName of this.fallbackOrder) {
      const provider = this.getProvider(providerName);
      if (!provider) continue;

      console.log(`[ProviderManager] Trying: ${providerName}`);
      const response = await provider.query(prompt);

      if (!response.error && response.content) {
        console.log(`[ProviderManager] Success: ${providerName} (${response.responseTimeMs}ms)`);
        return response;
      }

      errors.push(`${providerName}: ${response.error}`);
      console.warn(`[ProviderManager] Failed: ${providerName} — ${response.error}`);
    }

    return {
      provider: 'google-gemini',
      content: '',
      responseTimeMs: 0,
      error: `All providers failed: ${errors.join('; ')}`,
    };
  }

  /** Query multiple providers in parallel for visibility comparison */
  async queryAllProviders(
    prompt: string,
    providerNames?: AIProviderName[]
  ): Promise<AIProviderResponse[]> {
    const targetProviders = providerNames
      ? this.providers.filter((p) => providerNames.includes(p.name) && p.isConfigured())
      : this.getAvailableProviders();

    if (targetProviders.length === 0) {
      return [
        {
          provider: 'google-gemini',
          content: '',
          responseTimeMs: 0,
          error: 'Nessun provider AI configurato. Controlla le variabili in .env.local.',
        },
      ];
    }

    console.log(
      `[ProviderManager] Querying ${targetProviders.length} providers:`,
      targetProviders.map((p) => p.name)
    );

    const results = await Promise.allSettled(targetProviders.map((p) => p.query(prompt)));

    return results.map((result, index) => {
      if (result.status === 'fulfilled') return result.value;
      return {
        provider: targetProviders[index].name,
        content: '',
        responseTimeMs: 0,
        error: result.reason?.message || 'Unknown error',
      };
    });
  }
}

let instance: ProviderManager | null = null;

export function getProviderManager(): ProviderManager {
  if (!instance) instance = new ProviderManager();
  return instance;
}
