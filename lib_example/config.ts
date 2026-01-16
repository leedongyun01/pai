import { z } from 'zod';

const envSchema = z.object({
  TAVILY_API_KEY: z.string().min(1, 'TAVILY_API_KEY is required'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').default('file:./dev.db'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  GEMINI_API_VERSION: z.string().default('v1beta'),
});

const result = envSchema.safeParse(process.env);

export const config = result.success ? result.data : {
  TAVILY_API_KEY: process.env.TAVILY_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  NODE_ENV: (process.env.NODE_ENV as unknown) as 'development' | 'test' | 'production' || 'development',
  GEMINI_API_VERSION: process.env.GEMINI_API_VERSION || 'v1beta',
} as z.infer<typeof envSchema>;

if (!result.success) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.warn('⚠️ Missing environment variables during build (expected)');
  } else {
    console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
       throw new Error('Invalid environment variables');
    }
  }
}
