# 🌐 GEO Optimization Tool

Strumento open source per **Generative Engine Optimization (GEO)** / **AI Optimization (AIO)**.
Monitora e ottimizza la visibilità del tuo brand nei motori di ricerca AI come ChatGPT, Gemini e Perplexity.

Basato su [GetCito](https://github.com/ai-search-guru/getcito-worlds-first-open-source-aio-aeo-or-geo-tool).

## Stack Tecnologico

- **Next.js 15** con App Router e TypeScript
- **Firebase** (Authentication + Firestore)
- **Tailwind CSS** per lo styling
- **Recharts** per i grafici analytics
- **TanStack Query** per data fetching
- **Zod** per la validazione
- **Lucide React** per le icone
- **Multi-Provider AI**: Azure OpenAI, OpenAI Direct, Google Gemini, Perplexity

## Quick Start

```bash
# 1. Installa le dipendenze
npm install

# 2. Copia le variabili d'ambiente
cp .env.local.example .env.local
# Modifica .env.local con le tue chiavi API

# 3. Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Struttura Progetto

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── ai-query/       # API route per le query AI
│   │   └── brands/         # API route per i brand
│   ├── dashboard/
│   │   ├── analytics/      # Pagina analytics
│   │   ├── queries/        # Pagina query AI
│   │   ├── layout.tsx      # Layout dashboard con sidebar
│   │   └── page.tsx        # Dashboard principale
│   ├── signin/             # Pagina login
│   ├── signup/             # Pagina registrazione
│   ├── globals.css
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/
│   │   ├── BrandAnalyticsDisplay.tsx  # Grafico visibilità
│   │   ├── QueryInputWidget.tsx       # Widget query AI
│   │   ├── RecentQueries.tsx          # Query recenti
│   │   └── Sidebar.tsx               # Sidebar navigazione
│   └── ui/
│       └── StatCard.tsx               # Card statistiche
├── context/
│   └── AuthContext.tsx      # Contesto autenticazione Firebase
├── firebase/
│   ├── config.ts            # Firebase client config
│   └── firebase-admin.ts    # Firebase Admin SDK
├── hooks/
│   └── useAIQuery.ts        # Hook per query AI
└── lib/
    ├── api-providers/
    │   ├── provider-manager.ts  # Manager con fallback
    │   └── providers.ts         # Implementazioni provider
    ├── utils/
    │   ├── brand-analysis.ts    # Analisi menzioni brand
    │   └── helpers.ts           # Utility functions
    ├── types.ts                 # Type definitions (Zod + TS)
    └── index.ts                 # Barrel export
```

## Sistema Multi-Provider AI

Il cuore dell'app è il **Provider Manager** con fallback automatico:

1. **Azure OpenAI** → Provider primario
2. **OpenAI Direct** → Primo fallback
3. **Google Gemini** → Secondo fallback
4. **Perplexity** → Terzo fallback

Se un provider fallisce, il sistema passa automaticamente al successivo.
Per confronti di visibilità, tutti i provider vengono interrogati in parallelo.

## Configurazione Firebase

1. Crea un progetto su [Firebase Console](https://console.firebase.google.com/)
2. Abilita Authentication → Email/Password e Google
3. Crea un database Firestore
4. Copia le credenziali in `.env.local`

## Licenza

MIT — Basato su GetCito Open Source.
