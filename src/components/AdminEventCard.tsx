
'use client';

import type { CampusEvent } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarDays, MapPin, Clock, Users, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdminEventCardProps {
  event: CampusEvent;
  onDelete: (eventId: string) => void;
}

export default function AdminEventCard({ event, onDelete }: AdminEventCardProps) {
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
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href={`/admin/events/${event.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
        <Button variant="destructive" onClick={() => onDelete(event.id)} className="w-full sm:w-auto">
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
