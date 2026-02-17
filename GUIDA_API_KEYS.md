# 🔑 Guida Completa: API Key Gratuite e Configurazione

Questa guida ti spiega come ottenere **tutte le API key necessarie gratuitamente** per il progetto pilota GEO Optimization Tool.

---

## 📋 Riepilogo Provider Gratuiti

| Provider | Costo | Limite Free | Dove ottenerla |
|----------|-------|-------------|----------------|
| **Google Gemini** | Gratis | 250 req/giorno (Flash), 100 req/giorno (Pro) | Google AI Studio |
| **OpenRouter** | Gratis | 50 req/giorno (senza crediti), 1000/giorno con $1 di crediti | openrouter.ai |
| **Firebase** | Gratis | Spark Plan (no carta di credito) | Firebase Console |

> **Nota:** Azure OpenAI, OpenAI Direct e Perplexity API **non hanno free tier** reali per sviluppatori. Li abbiamo sostituiti con **OpenRouter** che dà accesso gratuito a modelli come Llama 3.3 70B, Gemini 2.0 Flash, DeepSeek V3, e altri.

---

## 1️⃣ Google Gemini API Key (GRATUITA)

### Cosa ottieni
- Accesso a Gemini 2.5 Flash: **10 RPM, 250 req/giorno**
- Accesso a Gemini 2.5 Pro: **5 RPM, 100 req/giorno**
- Context window fino a **1 milione di token**
- **Nessuna carta di credito richiesta**

### Come ottenere la key

1. Vai su **[Google AI Studio](https://aistudio.google.com/)**
2. Accedi con il tuo **account Google**
3. Clicca su **"Get API Key"** nella barra laterale sinistra
4. Clicca **"Create API Key"**
5. Seleziona un progetto Google Cloud esistente oppure creane uno nuovo (gratuito)
6. Copia la chiave generata (inizia con `AIza...`)

### Dove inserirla nel `.env.local`
```
GOOGLE_AI_API_KEY=AIzaSy....la-tua-chiave
```

### ⚠️ Limitazioni Free Tier
- I dati possono essere usati per migliorare i modelli Google
- Non disponibile per utenti EU/EEA/UK/Svizzera su alcuni modelli (Flash funziona ovunque)
- Rate limit più restrittivi dal Dicembre 2025
- Perfetto per prototipi e test interni

---

## 2️⃣ OpenRouter API Key (GRATUITA — sostituisce Azure/OpenAI/Perplexity)

### Cosa ottieni
OpenRouter è un gateway unificato che dà accesso a **18+ modelli gratuiti** tra cui:
- **Meta Llama 3.3 70B** — livello GPT-4, gratis
- **Google Gemini 2.0 Flash** — 1M token context, gratis
- **DeepSeek V3** — prestazioni frontier, gratis
- **Mistral** — modelli open source, gratis
- **NVIDIA Nemotron** — ottimo per agenti, gratis

Con un unico endpoint API compatibile OpenAI!

### Limiti
- **Senza acquisti:** 50 richieste/giorno su modelli free
- **Con $1 di crediti:** 1000 richieste/giorno su modelli free
- Nessuna carta di credito richiesta per il tier base

### Come ottenere la key

1. Vai su **[openrouter.ai](https://openrouter.ai/)**
2. Clicca **"Sign Up"** (puoi usare Google OAuth)
3. Una volta dentro, vai su **Dashboard → API Keys**
4. Clicca **"Create Key"**
5. Dai un nome alla chiave (es. "geo-tool-pilot")
6. Copia la chiave (inizia con `sk-or-v1-...`)

### Dove inserirla nel `.env.local`
```
OPENROUTER_API_KEY=sk-or-v1-....la-tua-chiave
```

### Come funziona nel codice
OpenRouter usa lo **stesso formato API di OpenAI**, quindi basta cambiare:
- **Base URL:** `https://openrouter.ai/api/v1`
- **Model:** `meta-llama/llama-3.3-70b-instruct:free` (o qualsiasi modello free)

### Modelli Free consigliati per il progetto
| Modello | Uso consigliato |
|---------|-----------------|
| `meta-llama/llama-3.3-70b-instruct:free` | Risposte generiche, analisi brand |
| `google/gemini-2.0-flash-exp:free` | Velocità, risposte rapide |
| `deepseek/deepseek-chat-v3-0324:free` | Ragionamento complesso |

---

## 3️⃣ Firebase (GRATUITA — Piano Spark)

### Cosa ottieni con Spark (gratuito)
- **Firestore:** 1 GiB storage, 50K letture/giorno, 20K scritture/giorno
- **Authentication:** illimitata (email/password, Google OAuth)
- **Hosting:** 10 GiB storage, 360 MB/giorno transfer
- **Nessuna carta di credito richiesta**

### Come configurare Firebase

#### A) Crea il progetto
1. Vai su **[Firebase Console](https://console.firebase.google.com/)**
2. Accedi con il tuo account Google
3. Clicca **"Aggiungi progetto"** (o "Add project")
4. Nome progetto: `geo-optimization-tool`
5. Disabilita Google Analytics (non serve per il pilota)
6. Clicca **"Crea progetto"**

#### B) Crea l'app Web
1. Dalla homepage del progetto, clicca sull'icona **Web** (`</>`)
2. Nickname app: `geo-tool-web`
3. ❌ NON abilitare Firebase Hosting (usiamo Vercel/locale)
4. Clicca **"Registra app"**
5. Ti verrà mostrato il blocco di configurazione — **copia tutti i valori**

```javascript
// Vedrai qualcosa come:
const firebaseConfig = {
  apiKey: "AIzaSyB...",              // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "geo-tool.firebaseapp.com",  // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "geo-optimization-tool",       // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "geo-tool.firebasestorage.app", // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",           // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc123"                 // → NEXT_PUBLIC_FIREBASE_APP_ID
};
```

#### C) Abilita Firestore Database
1. Nel menu sinistro, vai su **"Firestore Database"**
2. Clicca **"Crea database"**
3. Scegli la **posizione** (consigliato: `europe-west1` per l'Italia)
4. Seleziona **"Avvia in modalità test"** (per il pilota)
5. Clicca **"Crea"**

#### D) (Opzionale) Firebase Admin SDK — per operazioni server
> Se usi solo Firestore lato client, puoi saltare questo passaggio.

1. Vai su **Impostazioni progetto** (icona ingranaggio) → **Account di servizio**
2. Clicca **"Genera nuova chiave privata"**
3. Scarica il file JSON
4. Dal file JSON, copia:
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

---

## 4️⃣ File `.env.local` Completo

Crea il file `.env.local` nella root del progetto con questi valori:

```env
# ============================================
# GEO Optimization Tool - Variabili d'Ambiente
# ============================================

# --- Google Gemini (Provider Primario - GRATUITO) ---
GOOGLE_AI_API_KEY=AIzaSy_la_tua_chiave_qui

# --- OpenRouter (Provider Secondario - GRATUITO) ---
# Sostituisce Azure OpenAI, OpenAI Direct e Perplexity
OPENROUTER_API_KEY=sk-or-v1-la_tua_chiave_qui

# --- Firebase Client (GRATUITO - Piano Spark) ---
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tuo-progetto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tuo-progetto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tuo-progetto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# --- Firebase Admin (opzionale, per operazioni server) ---
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# --- App Configuration ---
NEXT_PUBLIC_APP_NAME=GEO Optimization Tool
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=development
```

---

## ✅ Checklist Finale

- [ ] Account Google (per Gemini + Firebase)
- [ ] API Key Gemini da [aistudio.google.com](https://aistudio.google.com/)
- [ ] Account OpenRouter da [openrouter.ai](https://openrouter.ai/)
- [ ] API Key OpenRouter dal Dashboard
- [ ] Progetto Firebase creato
- [ ] App Web registrata su Firebase
- [ ] Firestore Database creato
- [ ] File `.env.local` compilato con tutte le chiavi

---

## 🚀 Avvio

```bash
npm install
npm run dev
```

Apri **http://localhost:3000** e sei operativo!
