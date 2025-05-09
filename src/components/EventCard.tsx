
'use client';

import type { CampusEvent } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarDays, MapPin, Clock, Users, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: CampusEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date + 'T' + event.time);
  const formattedDate = eventDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">{event.name}</CardTitle>
        <CardDescription className="flex items-center text-sm text-muted-foreground pt-1">
          <CalendarDays className="mr-2 h-4 w-4" /> {formattedDate}
          <Clock className="ml-4 mr-2 h-4 w-4" /> {formattedTime}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex items-start">
            <MapPin className="mr-2 h-4 w-4 mt-1 text-accent flex-shrink-0" />
            <span className="text-foreground">{event.location}</span>
          </div>
          <p className="text-sm text-foreground line-clamp-3">{event.description}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4 text-accent" />
            <span>{event.attendees.length} registered</span>
          </div>
          {event.organizers && (
            <Badge variant="secondary" className="mt-2">Organized by: {event.organizers}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/events/${event.id}`}>View Details & Register</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
