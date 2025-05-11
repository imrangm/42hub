'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { addEvent, updateEvent, type NewEventPayload } from '@/lib/localStorage';
import type { CampusEvent } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const eventFormSchema = z.object({
  name: z.string().min(3, { message: 'Event name must be at least 3 characters.' }),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date format.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:MM).' }),
  location: z.string().min(3, { message: 'Location must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  organizers: z.string().min(2, { message: 'Organizer name must be at least 2 characters.' })
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  event?: CampusEvent;
  onSuccess?: () => void;
}

export default function EventForm({ event, onSuccess }: EventFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: event ? {
      name: event.name,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      organizers: event.organizers
    } : undefined
  });

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    try {
      if (event) {
        await updateEvent({ ...event, ...data });
        toast({
          title: 'Success',
          description: 'Event updated successfully.',
        });
      } else {
        await addEvent(data as NewEventPayload);
        toast({
          title: 'Success',
          description: 'Event created successfully.',
        });
        reset();
      }
      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{event ? 'Edit Event' : 'Create New Event'}</CardTitle>
        <CardDescription>
          {event ? 'Update the event details below.' : 'Fill in the details to create a new event.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter event name"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                {...register('time')}
              />
              {errors.time && <p className="text-sm text-destructive">{errors.time.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="Enter event location"
            />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter event description"
              rows={4}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizers">Organizers</Label>
            <Input
              id="organizers"
              {...register('organizers')}
              placeholder="Enter organizer names"
            />
            {errors.organizers && <p className="text-sm text-destructive">{errors.organizers.message}</p>}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {event ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              event ? 'Update Event' : 'Create Event'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

