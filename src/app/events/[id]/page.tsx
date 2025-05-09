
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import type { CampusEvent } from '@/lib/types';
import { getEventById, updateEvent } from '@/lib/localStorage';
import EventRegistrationForm from '@/components/EventRegistrationForm';
import GeneratedContentDialog from '@/components/GeneratedContentDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarDays, Clock, MapPin, Users, Info, Edit, Wand2, Loader2, Twitter, Mail } from 'lucide-react';
import { handleGeneratePromotionalContent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';

export default function EventDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params.id as string;
  const { toast } = useToast();

  const [event, setEvent] = useState<CampusEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [isDialogOpenned, setIsDialogOpened] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    setIsAdminView(searchParams.get('admin') === 'true');
  }, [searchParams]);

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

  const onGenerateContent = async (contentType: 'socialMediaPost' | 'emailSnippet') => {
    if (!event?.description) {
      toast({ title: "Error", description: "Event description is missing.", variant: "destructive" });
      return;
    }
    setIsGeneratingContent(true);
    setDialogTitle(contentType === 'socialMediaPost' ? 'Generated Social Media Post' : 'Generated Email Snippet');
    setGeneratedContent(null); 
    setIsDialogOpened(true);

    try {
      const result = await handleGeneratePromotionalContent(event.description, contentType);
      if (result.success && result.content) {
        setGeneratedContent(result.content);
        if (event) { 
          const updatedEvent = {
            ...event,
            [contentType === 'socialMediaPost' ? 'generatedSocialMediaPost' : 'generatedEmailSnippet']: result.content
          };
          updateEvent(updatedEvent);
          setEvent(updatedEvent); 
        }
      } else {
        throw new Error(result.error || 'Unknown error generating content');
      }
    } catch (error: any) {
      setGeneratedContent(`Failed to generate content: ${error.message}`);
      toast({ title: "Error Generating Content", description: error.message, variant: "destructive" });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  if (isLoading) {
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
          <Link href="/">Back to Events</Link>
        </Button>
      </div>
    );
  }
  
  const eventDate = new Date(event.date + 'T' + event.time);
  const formattedDate = eventDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Main Event Details Column */}
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
            
            <Separator />

            <h3 className="text-xl font-semibold text-primary">About this Event</h3>
            <p className="text-foreground whitespace-pre-line leading-relaxed">{event.description}</p>
            
            {event.organizers && (
                 <p className="text-sm text-muted-foreground">
                   <strong className="text-foreground">Organized by:</strong> {event.organizers}
                 </p>
            )}
          </CardContent>
        </Card>

        {/* AI Content Generation Section - Admin Only */}
        {isAdminView && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center text-primary">
                <Wand2 className="mr-2 h-5 w-5 text-accent" /> AI Promotional Tools (Admin)
              </CardTitle>
              <CardDescription>Generate promotional content for this event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => onGenerateContent('socialMediaPost')} className="w-full justify-start" variant="outline" disabled={isGeneratingContent}>
                {isGeneratingContent && dialogTitle.includes('Social') ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Twitter className="mr-2 h-4 w-4 text-blue-500" />}
                Generate Social Media Post
              </Button>
              {event.generatedSocialMediaPost && <p className="text-xs text-muted-foreground p-2 border rounded-md bg-muted/30">Last generated post: {event.generatedSocialMediaPost.substring(0,70)}...</p>}

              <Button onClick={() => onGenerateContent('emailSnippet')} className="w-full justify-start" variant="outline" disabled={isGeneratingContent}>
                {isGeneratingContent && dialogTitle.includes('Email') ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4 text-red-500" />}
                Generate Email Snippet
              </Button>
               {event.generatedEmailSnippet && <p className="text-xs text-muted-foreground p-2 border rounded-md bg-muted/30">Last generated email: {event.generatedEmailSnippet.substring(0,70)}...</p>}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar Column for Registration and Attendees */}
      <div className="space-y-6">
        <Card className="shadow-lg sticky top-24"> {/* Sticky for registration card */}
          <CardHeader>
            <CardTitle className="text-xl text-primary">Register</CardTitle>
            <CardDescription>Secure your spot for this event.</CardDescription>
          </CardHeader>
          <CardContent>
            <EventRegistrationForm eventId={eventId} onSuccessfulRegistration={handleSuccessfulRegistration} />
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
                    <li key={attendee.id} className="text-sm text-foreground p-2 bg-muted/30 rounded-md">{attendee.name}</li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">No attendees registered yet. Be the first!</p>
            )}
          </CardContent>
        </Card>
      </div>

      <GeneratedContentDialog
        isOpen={isDialogOpenned}
        onClose={() => setIsDialogOpened(false)}
        title={dialogTitle}
        content={generatedContent}
        isLoading={isGeneratingContent}
      />
    </div>
  );
}
