declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_GA_ID?: string;
    }
  }
}

export {};
