export const AI_MODELS = {
  // 최신 별칭(latest)을 사용하거나 특정 버전을 명시
  FLASH: process.env.MOCK_AI === 'true' ? 'mock' : 'gemini-1.5-flash',
  PRO: process.env.MOCK_AI === 'true' ? 'mock' : 'gemini-1.5-pro',
};

export function isMockMode(): boolean {
  // 환경변수가 명시적으로 true이거나, API 키가 없거나, 
  // 사용자가 임시 중단을 요청한 경우(SKIP_GEMINI 등)를 모두 포함
  return (
    process.env.MOCK_AI === 'true' || 
    process.env.SKIP_GEMINI === 'true' ||
    !process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY === 'your_api_key_here'
  );
}