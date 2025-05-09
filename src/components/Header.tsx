
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
          Campus Hub
        </Link>
        <Button asChild variant="secondary">
          <Link href="/events/create">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Event
          </Link>
        </Button>
      </div>
    </header>
  );
}
