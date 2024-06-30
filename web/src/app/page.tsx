import { Header } from '@/app/components/Header';
import { Center } from '@/app/components/Center';
import { Footer } from '@/app/components/Footer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Header />

      <Center />

      <Footer />
    </main>
  );
}
