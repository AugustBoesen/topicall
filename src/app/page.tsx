import Header from '@/components/header';
import Card from '@/components/card';

export default function Home() {
  return (
    <main className='polka'>
      <Header />
      <Card />
      {/* Footer is defined inside the card component */}
    </main>
  );
}
