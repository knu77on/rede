# REDE

AI-powered voice dictation for macOS. Hold a key, speak, and REDE transcribes your speech and types it into any app — with smart corrections, filler removal, and context-aware tone matching.

Built with **Tauri 2** (Rust backend) + **React 18** (TypeScript frontend).

---

## Quick Start

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18+ | `brew install node` |
| Rust | 1.70+ | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| Tauri CLI | 2.x | `cargo install tauri-cli --version "^2.0"` |
| Xcode CLT | Latest | `xcode-select --install` |

### Install & Run

```bash
# Clone and install
git clone <repo-url> rede && cd rede
npm install

# Run the frontend only (browser, no Tauri needed)
npm run dev
# Open http://localhost:1420/?demo

# Run the full Tauri desktop app (requires Rust + macOS)
cargo tauri dev
```

---

## Demo Mode

You can preview the entire UI without any backend services, API keys, or Tauri runtime. Just add `?demo` to the URL:

| URL | What it shows |
|-----|---------------|
| `http://localhost:1420/?demo` | **HUD** — animated recording simulation with equalizer, transcription cycling |
| `http://localhost:1420/?demo&view=settings` | **Settings** — all 5 tabs (General, Voice, Processing, Privacy, Account) |
| `http://localhost:1420/?demo&view=auth` | **Auth** — login / register / OAuth screens |

Demo mode:
- Bypasses authentication
- Simulates recording → processing → transcription cycles
- Generates random audio levels for the equalizer
- Cycles through sample phrases
- No microphone, no APIs, no Supabase needed

---

## Project Structure

```
rede/
├── src/                          # React frontend
│   ├── App.tsx                   # Root — routes to HUD / Settings / Auth
│   ├── demo.ts                  # Demo mode simulation engine
│   ├── main.tsx                 # Entry point
│   ├── components/
│   │   ├── auth/                # AuthScreen, LoginForm, RegisterForm
│   │   ├── hud/                 # FloatingHUD, HUDCapsule, Equalizer
│   │   ├── menu/                # MenuBarDropdown, MenuItem
│   │   ├── settings/            # SettingsWindow + 5 tab panels
│   │   └── common/              # Toggle, Button, Input
│   ├── hooks/                   # useAudio, useHotkey, useEqualizer, useAuth, useSettings
│   ├── stores/                  # Zustand: auth, settings, recording, history
│   ├── services/                # API clients: whisper, claude, supabase, stripe
│   ├── types/                   # TypeScript interfaces for models, API, DB
│   └── utils/                   # colors, constants, helpers, formatters
│
├── src-tauri/                   # Rust backend (Tauri 2)
│   ├── src/
│   │   ├── lib.rs               # Tauri commands (IPC bridge)
│   │   ├── audio/               # cpal capture, device enum, DSP processing
│   │   ├── keyboard/            # rdev global hotkey listener
│   │   ├── accessibility/       # AX text insertion, permission checking
│   │   ├── storage/             # SQLite database, macOS Keychain
│   │   └── system/              # Tray icon, notifications, launch-at-login
│   ├── Cargo.toml               # Rust dependencies
│   ├── tauri.conf.json          # Tauri window/bundle/CSP config
│   └── entitlements.plist       # macOS permissions
│
├── package.json                 # Node dependencies & scripts
├── tsconfig.json                # TypeScript strict mode + path aliases
├── vite.config.ts               # Vite build config
├── .eslintrc.cjs                # ESLint rules
└── .prettierrc                  # Prettier formatting
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    macOS System                      │
│  ┌───────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Microphone│  │ Keyboard │  │ Accessibility API│  │
│  └─────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│        │              │                 │            │
│  ┌─────▼──────────────▼─────────────────▼─────────┐  │
│  │              Rust Backend (Tauri)               │  │
│  │  audio/capture ─► audio/processing              │  │
│  │  keyboard/listener ─► keyboard/hotkey           │  │
│  │  accessibility/text_insertion                    │  │
│  │  storage/database (SQLite) + keychain           │  │
│  └─────────────────────┬──────────────────────────┘  │
│                        │ IPC (invoke/events)         │
│  ┌─────────────────────▼──────────────────────────┐  │
│  │            React Frontend (WebView)             │  │
│  │  FloatingHUD ◄── recordingStore ──► Whisper API │  │
│  │  Settings    ◄── settingsStore                  │  │
│  │  Auth        ◄── authStore    ──► Supabase      │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Data flow for a dictation:**
1. User holds Ctrl → Rust `keyboard/listener` fires `hotkey-pressed` event
2. Frontend starts recording → Rust `audio/capture` streams PCM audio
3. User releases Ctrl → audio sent to OpenAI Whisper for transcription
4. Transcription optionally processed by Claude (filler removal, corrections)
5. Final text inserted via Rust `accessibility/text_insertion` (AX API → clipboard fallback)

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (frontend only, port 1420) |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run Jest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `cargo tauri dev` | Full Tauri app (frontend + Rust backend) |
| `cargo tauri build` | Production macOS .app + .dmg |

---

## Environment Variables

Copy `.env.example` and create `.env` for local development:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
VITE_OPENAI_API_KEY=sk-xxx
VITE_ANTHROPIC_API_KEY=sk-ant-xxx
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

These are only needed for real functionality. Demo mode works without any env vars.

---

## macOS Permissions

REDE requires three system permissions (configured in `entitlements.plist`):

| Permission | Why |
|-----------|-----|
| **Microphone** | Capture voice for transcription |
| **Accessibility** | Insert text into other applications |
| **Input Monitoring** | Detect global hotkey (Ctrl) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop framework | Tauri 2.0 (Rust) |
| Frontend | React 18 + TypeScript |
| Build tool | Vite 5 |
| State management | Zustand |
| Audio capture | cpal (Rust) |
| Keyboard hooks | rdev (Rust) |
| Text insertion | macOS Accessibility API |
| Speech-to-text | OpenAI Whisper API |
| AI processing | Anthropic Claude |
| Auth | Supabase Auth |
| Database | SQLite (local) + Supabase PostgreSQL (cloud) |
| Payments | Stripe |
| Error tracking | Sentry |

---

## License

Proprietary. All rights reserved.
