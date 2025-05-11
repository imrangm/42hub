
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { CampusEvent } from '@/lib/types';
import { getEvents, deleteEvent as deleteEventFromStorage, addEvent, type NewEventPayload } from '@/lib/localStorage';
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
import { PlusCircle, Search, Loader2, CalendarX2, Upload, Download } from 'lucide-react';
import { formatToICSDateString, escapeCsvField } from '@/lib/utils'; // Added escapeCsvField

export default function ManageEventsPage() {
  const [allEvents, setAllEvents] = useState<CampusEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<CampusEvent | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchEvents = useCallback(() => {
    setIsLoading(true);
    const eventsFromStorage = getEvents();
    const sortedEvents = eventsFromStorage.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return dateB - dateA; 
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
        (event.organizers && event.organizers.toLowerCase().includes(lowerSearchTerm))
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
        fetchEvents(); 
      } else {
        toast({ title: 'Error', description: 'Failed to delete event.', variant: 'destructive' });
      }
      setEventToDelete(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (eventReader) => {
      const text = eventReader.target?.result as string;
      if (!text) {
        toast({ title: 'Error reading file', description: 'File content is empty or unreadable.', variant: 'destructive' });
        setIsImporting(false);
        return;
      }

      const lines = text.split(/\r\n|\n/).map(line => line.trim()).filter(line => line);
      if (lines.length <= 1) {
        toast({ title: 'Invalid CSV', description: 'CSV must contain a header row and at least one data row.', variant: 'destructive' });
        setIsImporting(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const expectedHeaders = ['name', 'date', 'time', 'location', 'description', 'organizers']; 
      
      const missingHeaders = expectedHeaders.filter(eh => !headers.includes(eh));
      if (missingHeaders.length > 0) {
        toast({ title: 'Invalid CSV Headers', description: `Missing required headers: ${missingHeaders.join(', ')}. Expected: ${expectedHeaders.join(', ')} (keywords is optional).`, variant: 'destructive' });
        setIsImporting(false);
        return;
      }
      
      let importedCount = 0;
      let errorCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(','); 
        const eventData: Record<string, string> = {};
        headers.forEach((header, index) => {
          eventData[header] = values[index] ? values[index].trim() : '';
        });

        const eventInput: NewEventPayload = {
          name: eventData.name || '',
          date: eventData.date || '',
          time: eventData.time || '',
          location: eventData.location || '',
          description: eventData.description || '',
          organizers: eventData.organizers || '',
          keywords: eventData.keywords || undefined,
        };

        if (!eventInput.name || !eventInput.date || !eventInput.time || !eventInput.location || !eventInput.description || !eventInput.organizers) {
          console.warn(`Skipping invalid row ${i + 1}: Missing required fields for event "${eventInput.name || 'N/A'}".`);
          errorCount++;
          continue;
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(eventInput.date)) {
           console.warn(`Skipping invalid row ${i + 1}: Invalid date format for event "${eventInput.name}". Expected YYYY-MM-DD, got "${eventInput.date}".`);
           errorCount++;
           continue;
        }
        if (!/^\d{2}:\d{2}$/.test(eventInput.time)) {
           console.warn(`Skipping invalid row ${i + 1}: Invalid time format for event "${eventInput.name}". Expected HH:MM, got "${eventInput.time}".`);
           errorCount++;
           continue;
        }

        try {
          addEvent(eventInput);
          importedCount++;
        } catch (err) {
          console.error(`Error adding event "${eventInput.name}" from CSV:`, err);
          errorCount++;
        }
      }
      
      toast({ 
        title: 'CSV Import Complete', 
        description: `${importedCount} events imported. ${errorCount} rows had errors or were skipped.`
      });
      fetchEvents();
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; 
      }
    };

    reader.onerror = () => {
      toast({ title: 'Error reading file', variant: 'destructive' });
      setIsImporting(false);
    };
    reader.readAsText(file);
  };

  const handleExportCsv = () => {
    setIsExporting(true);
    const headers = ['ID', 'Name', 'Date', 'Time', 'Location', 'Description', 'Organizers', 'Keywords', 'Attendees Count', 'Registered Attendees (Emails)'];
    const csvRows = [headers.join(',')];

    filteredEvents.forEach(event => {
      const row = [
        escapeCsvField(event.id),
        escapeCsvField(event.name),
        escapeCsvField(event.date),
        escapeCsvField(event.time),
        escapeCsvField(event.location),
        escapeCsvField(event.description),
        escapeCsvField(event.organizers || ''),
        escapeCsvField(event.keywords || ''),
        event.attendees.length.toString(),
        escapeCsvField(event.attendees.map(a => a.email).join('; '))
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'campus_events_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    setIsExporting(false);
    toast({ title: 'CSV Exported', description: 'Events data has been downloaded.' });
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
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={() => fileInputRef.current?.click()} disabled={isImporting || isLoading} variant="outline" className="w-full sm:w-auto">
                {isImporting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Upload className="mr-2 h-5 w-5" />}
                Import CSV
            </Button>
            <input 
                type="file" 
                ref={fileInputRef} 
                accept=".csv" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
                id="csv-importer"
            />
             <Button onClick={handleExportCsv} disabled={isExporting || isLoading || filteredEvents.length === 0} variant="outline" className="w-full sm:w-auto">
                {isExporting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                Export CSV
            </Button>
            <Button asChild className="w-full sm:w-auto">
                <Link href="/admin/events/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Event
                </Link>
            </Button>
        </div>
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
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-10 bg-card p-8 rounded-lg shadow">
          <CalendarX2 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground mb-4">
            {allEvents.length === 0 ? "No events created yet." : "No events match your search."}
          </p>
           {allEvents.length === 0 && (
             <p className="text-md text-muted-foreground mb-6">Start by creating a new event or importing from CSV.</p>
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

