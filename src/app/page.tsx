
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CampusEvent } from '@/lib/types';
import { getEvents } from '@/lib/localStorage';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, CalendarX2 } from 'lucide-react';

export default function HomePage() {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(() => {
    setIsLoading(true);
    const allEvents = getEvents();
    // Sort events by date and time, future events first
    const sortedEvents = allEvents.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return dateA - dateB;
    });
    // Filter out past events (optional, could be a feature)
    // const upcomingEvents = sortedEvents.filter(event => new Date(`${event.date}T${event.time}`).getTime() >= new Date().getTime());
    setEvents(sortedEvents);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
    // Optional: Add event listener for storage changes from other tabs
    const handleStorageChange = () => fetchEvents();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchEvents]);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Upcoming Events</h1>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-10 bg-card p-8 rounded-lg shadow">
          <CalendarX2 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground mb-4">No upcoming events found.</p>
          <p className="text-md text-muted-foreground mb-6">Why not create one?</p>
          <Button asChild size="lg">
            <Link href="/events/create">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Event
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
