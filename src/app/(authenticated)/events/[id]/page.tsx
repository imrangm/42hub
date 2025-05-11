'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import type { CampusEvent } from '@/lib/types';
import { getEventById, updateEvent } from '@/lib/localStorage';
import EventRegistrationForm from '@/components/EventRegistrationForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarDays, Clock, MapPin, Users, Info, Edit, CalendarPlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { formatToICSDateString, escapeICSDescription } from '@/lib/utils';

export default function EventDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params.id as string;
  const { toast } = useToast();
  const { user, role, loading: authLoading } = useAuth(); 

  const [event, setEvent] = useState<CampusEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [isDialogOpenned, setIsDialogOpened] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    setIsAdminView(!authLoading && !!user && role === 'admin' && searchParams.get('admin') === 'true');
  }, [searchParams, user, role, authLoading]);

  const fetchEventDetails = useCallback(() => {
    if (eventId) {
      setIsLoading(true);
      const foundEvent = getEventById(eventId);
      setEvent(foundEvent);
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  const handleSuccessfulRegistration = () => {
    fetchEventDetails();
  };

  const handleExportIcs = () => {
    if (!event) return;

    const startDate = new Date(`${event.date}T${event.time}`);
    // Assume 1 hour duration if no end time specified.
    // For more complex scenarios, you'd need an end date/time field.
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); 

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CampusHub//NONSGML Event Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@campushub.events`,
      `DTSTAMP:${formatToICSDateString(new Date())}`,
      `DTSTART:${formatToICSDateString(startDate)}`,
      `DTEND:${formatToICSDateString(endDate)}`,
      `SUMMARY:${event.name}`,
      `DESCRIPTION:${escapeICSDescription(event.description)}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${event.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: 'Calendar File Exported', description: 'Event has been downloaded as an .ics file.' });
    } else {
      toast({ title: 'Export Failed', description: 'Your browser does not support this feature.', variant: 'destructive'});
    }
  };


  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-10">
        <Info className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">Event Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">The event you are looking for does not exist or may have been removed.</p>
        <Button asChild>
          <Link href="/dashboard">Back to Events</Link>
        </Button>
      </div>
    );
  }
  
  const eventDate = new Date(event.date + 'T' + event.time);
  const formattedDate = eventDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
            <Image 
              src={`https://picsum.photos/seed/${event.id}/1200/400`} 
              alt={`${event.name} banner`} 
              fill
              style={{objectFit: "cover"}}
              data-ai-hint="event conference"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <CardTitle className="absolute bottom-4 left-4 text-3xl font-bold text-primary-foreground">
              {event.name}
            </CardTitle>
          </div>
          
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
              <div className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-accent" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-accent" />
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-accent" />
                <span>{event.location}</span>
              </div>
            </div>
            
            <Button onClick={handleExportIcs} variant="outline" size="sm" className="w-full sm:w-auto">
              <CalendarPlus className="mr-2 h-4 w-4" /> Add to Calendar
            </Button>

            <Separator />

            <h3 className="text-xl font-semibold text-primary">About this Event</h3>
            <p className="text-foreground whitespace-pre-line leading-relaxed">{event.description}</p>
            
            {event.organizers && (
                 <p className="text-sm text-muted-foreground">
                   <strong className="text-foreground">Organized by:</strong> {event.organizers}
                 </p>
            )}

            {isAdminView && (
              <div className="pt-4">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href={`/admin/events/${event.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Event (Admin)
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-primary">
              <Users className="mr-2 h-5 w-5 text-accent" /> Attendees ({event.attendees.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {event.attendees.length > 0 ? (
              <ScrollArea className="h-48">
                <ul className="space-y-2">
                  {event.attendees.map(attendee => (
                    <li key={attendee.id} className="text-sm text-foreground p-2 bg-muted/30 rounded-md">{attendee.name} ({attendee.email})</li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">No attendees registered yet. {isAdminView ? '' : 'Be the first!'}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {!isAdminView && ( 
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Register</CardTitle>
              <CardDescription>Secure your spot for this event.</CardDescription>
            </CardHeader>
            <CardContent>
              <EventRegistrationForm eventId={eventId} onSuccessfulRegistration={handleSuccessfulRegistration} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

