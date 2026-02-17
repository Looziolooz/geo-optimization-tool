import { GoogleGeminiProvider, OpenRouterChatGPTProvider, OpenRouterPerplexityProvider, BaseAIProvider } from './providers';
import { AIProviderName, AIProviderResponse } from '@/lib/types';

export class ProviderManager {
  private providers: BaseAIProvider[] = [
    new GoogleGeminiProvider(),
    new OpenRouterChatGPTProvider(),
    new OpenRouterPerplexityProvider(),
  ];

  getAvailable(): BaseAIProvider[] {
    return this.providers.filter((p) => p.isConfigured());
  }

  async queryAll(prompt: string, names?: AIProviderName[]): Promise<AIProviderResponse[]> {
    const targets = names
      ? this.providers.filter((p) => names.includes(p.name) && p.isConfigured())
      : this.getAvailable();

    if (!targets.length) return [{ provider: 'google-gemini', content: '', responseTimeMs: 0, error: 'No providers configured' }];

    const results = await Promise.allSettled(targets.map((p) => p.query(prompt)));
    return results.map((r, i) =>
      r.status === 'fulfilled' ? r.value : { provider: targets[i].name, content: '', responseTimeMs: 0, error: r.reason?.message }
    );
  }
}

let _instance: ProviderManager;
export function getProviderManager(): ProviderManager {
  if (!_instance) _instance = new ProviderManager();
  return _instance;
}
