import { LoginView } from '@/components/LoginView';
import { checkInitAction } from '@/features/auth/actions';

export default async function Home() {
  const isInitialized = await checkInitAction();
  return <LoginView isInitialized={isInitialized} />;
}