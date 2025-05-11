'use client';

import { useState, useEffect } from 'react';
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
import { handleGenerateDescription } from '@/lib/actions';
import { Wand2, Loader2 } from 'lucide-react';
import type { CampusEvent } from '@/lib/types';

const eventFormSchema = z.object({
  name: z.string().min(3, { message: 'Event name must be at least 3 characters.' }),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date format.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:MM).' }),
  location: z.string().min(3, { message: 'Location must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  organizers: z.string().min(2, { message: 'Organizer name must be at least 2 characters.' }),
  keywords: z.string().optional(), // For AI description generation
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  eventToEdit?: CampusEvent;
}

export default function EventForm({ eventToEdit }: EventFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditMode = !!eventToEdit;

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Default to today for new events
    }
  });

  useEffect(() => {
    if (isEditMode && eventToEdit) {
      reset({
        name: eventToEdit.name,
        date: eventToEdit.date,
        time: eventToEdit.time,
        location: eventToEdit.location,
        description: eventToEdit.description,
        organizers: eventToEdit.organizers,
      });
    } else if (!isEditMode) {
        // Ensure form is reset to default for new event creation if eventToEdit becomes undefined
        reset({
            name: '',
            date: new Date().toISOString().split('T')[0],
            time: '',
            location: '',
            description: '',
            organizers: '',
        });
    }
  }, [isEditMode, eventToEdit, reset]);

  const onSubmit: SubmitHandler<EventFormValues> = (data) => {
    try {
      if (isEditMode && eventToEdit) {
        const updatedEventData: CampusEvent = {
          ...eventToEdit, 
          ...data, // This will correctly overwrite fields including keywords
        };
        const success = updateEvent(updatedEventData);
        if (success) {
          toast({ title: 'Event Updated!', description: `"${updatedEventData.name}" has been successfully updated.` });
          router.push('/admin/events/manage'); 
        } else {
          throw new Error('Failed to find event for update.');
        }
      } else {
        // data is EventFormValues which is compatible with NewEventPayload
        const newEventPayload: NewEventPayload = {
            name: data.name,
            date: data.date,
            time: data.time,
            location: data.location,
            description: data.description,
            organizers: data.organizers,
        };
        const newEvent = addEvent(newEventPayload);
        toast({ title: 'Event Created!', description: `"${newEvent.name}" has been successfully created.` });
        router.push('/admin/events/manage'); 
      }
    } catch (error: any) {
      toast({
        title: `Error ${isEditMode ? 'Updating' : 'Creating'} Event`,
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} event:`, error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">
          {isEditMode ? `Edit Event: ${eventToEdit?.name}` : 'Create New Event'}
        </CardTitle>
        <CardDescription>
          {isEditMode ? 'Update the details for this event.' : 'Fill in the details below to create a new campus event.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input id="name" {...register('name')} placeholder="e.g., Annual Tech Fest" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" {...register('time')} />
              {errors.time && <p className="text-sm text-destructive">{errors.time.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register('location')} placeholder="e.g., Main Auditorium" />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="organizers">Organizers</Label>
            <Input id="organizers" {...register('organizers')} placeholder="e.g., Computer Science Department" />
            {errors.organizers && <p className="text-sm text-destructive">{errors.organizers.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">Event Description</Label>
            </div>
            <Textarea id="description" {...register('description')} placeholder="Describe the event..." rows={5} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditMode ? 'Update Event' : 'Create Event'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

