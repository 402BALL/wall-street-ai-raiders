/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GROK_API_KEY: string
  readonly VITE_CLAUDE_API_KEY: string
  readonly VITE_DEEPSEEK_API_KEY: string
  readonly VITE_OPENAI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

