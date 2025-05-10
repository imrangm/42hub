
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EventForm from '@/components/EventForm';
import type { CampusEvent } from '@/lib/types';
import { getEventById } from '@/lib/localStorage';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const [event, setEvent] = useState<CampusEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      const foundEvent = getEventById(eventId);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        setError('Event not found.');
      }
      setIsLoading(false);
    } else {
      setError('No event ID provided.');
      setIsLoading(false);
    }
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Error</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button asChild>
          <Link href="/admin/events/manage">Back to Manage Events</Link>
        </Button>
      </div>
    );
  }

  if (!event) {
     // Should be caught by error state, but as a fallback
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Event Not Found</h2>
        <p className="text-muted-foreground mb-6">The event could not be loaded for editing.</p>
        <Button asChild>
          <Link href="/admin/events/manage">Back to Manage Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <EventForm eventToEdit={event} />
    </div>
  );
}
