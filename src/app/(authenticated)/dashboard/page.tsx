
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CampusEvent } from '@/lib/types';
import { getEvents } from '@/lib/localStorage';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, CalendarX2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

export default function DashboardPage() {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, role } = useAuth(); // Get user role

  const fetchEvents = useCallback(() => {
    setIsLoading(true);
    try {
      const allEvents = getEvents();
      // Sort events by date and time, future events first
      const sortedEvents = allEvents.sort((a, b) => {
        // Ensure date and time are valid before creating Date objects
        const dateAValid = a.date && a.time;
        const dateBValid = b.date && b.time;

        if (!dateAValid && !dateBValid) return 0;
        if (!dateAValid) return 1; // Put events without valid date/time last
        if (!dateBValid) return -1; // Put events without valid date/time last
        
        const dateA = new Date(`${a.date}T${a.time}`).getTime();
        const dateB = new Date(`${b.date}T${b.time}`).getTime();
        
        if (isNaN(dateA) && isNaN(dateB)) return 0;
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;

        return dateA - dateB;
      });
      setEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching or processing events:", error);
      setEvents([]); // Set to empty or show an error message
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    // Optional: Add event listener for storage changes from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'campusHubEvents') { // Only refetch if relevant storage changes
        fetchEvents();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchEvents]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Upcoming Events at 42 Abu Dhabi</h1>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-10 bg-card p-8 rounded-lg shadow">
          <CalendarX2 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground mb-4">No upcoming events found.</p>
          {role === 'admin' && ( // Only show Create Event button if user is admin
            <>
              <p className="text-md text-muted-foreground mb-6">Time to schedule some innovative sessions!</p>
              <Button asChild size="lg">
                <Link href="/admin/events/create"> {/* Link to admin create page */}
                  <PlusCircle className="mr-2 h-5 w-5" /> Create New Event
                </Link>
              </Button>
            </>
          )}
          {role !== 'admin' && (
             <p className="text-md text-muted-foreground">Keep an eye out for new coding bootcamps, workshops, and community events!</p>
          )}
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

