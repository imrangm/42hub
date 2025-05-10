
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CampusEvent } from '@/lib/types';
import { getEvents, deleteEvent as deleteEventFromStorage } from '@/lib/localStorage';
import AdminEventCard from '@/components/AdminEventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { PlusCircle, Search, ListFilter, Loader2, CalendarX2 } from 'lucide-react';

export default function ManageEventsPage() {
  const [allEvents, setAllEvents] = useState<CampusEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [eventToDelete, setEventToDelete] = useState<CampusEvent | null>(null);
  const { toast } = useToast();

  const fetchEvents = useCallback(() => {
    setIsLoading(true);
    const eventsFromStorage = getEvents();
    // Sort events by date, newest first for management view might be better
    const sortedEvents = eventsFromStorage.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return dateB - dateA; // Newest first
    });
    setAllEvents(sortedEvents);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        event.name.toLowerCase().includes(lowerSearchTerm) ||
        event.description.toLowerCase().includes(lowerSearchTerm) ||
        event.location.toLowerCase().includes(lowerSearchTerm) ||
        event.organizers.toLowerCase().includes(lowerSearchTerm)
      );
    });
  }, [allEvents, searchTerm]);

  const handleDeleteRequest = (eventId: string) => {
    const event = allEvents.find(e => e.id === eventId);
    if (event) {
      setEventToDelete(event);
    }
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      const success = deleteEventFromStorage(eventToDelete.id);
      if (success) {
        toast({ title: 'Event Deleted', description: `"${eventToDelete.name}" has been removed.` });
        fetchEvents(); // Refresh the list
      } else {
        toast({ title: 'Error', description: 'Failed to delete event.', variant: 'destructive' });
      }
      setEventToDelete(null);
    }
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-primary">Manage Events</h1>
        <Button asChild>
          <Link href="/admin/events/create">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Event
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events (name, location, organizer...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        {/* Placeholder for future filter button 
        <Button variant="outline">
          <ListFilter className="mr-2 h-5 w-5" /> Filters
        </Button>
        */}
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-10 bg-card p-8 rounded-lg shadow">
          <CalendarX2 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground mb-4">
            {allEvents.length === 0 ? "No events created yet." : "No events match your search."}
          </p>
           {allEvents.length === 0 && (
             <p className="text-md text-muted-foreground mb-6">Start by creating a new event.</p>
           )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <AdminEventCard key={event.id} event={event} onDelete={handleDeleteRequest} />
          ))}
        </div>
      )}

      {eventToDelete && (
        <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the event "{eventToDelete.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setEventToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
