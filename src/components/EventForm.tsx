
'use client';

import { useState } from 'react';
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
import { addEvent } from '@/lib/localStorage';
import { handleGenerateDescription } from '@/lib/actions';
import { Wand2, Loader2 } from 'lucide-react';

const eventFormSchema = z.object({
  name: z.string().min(3, { message: 'Event name must be at least 3 characters.' }),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date format.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:MM).' }),
  location: z.string().min(3, { message: 'Location must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  organizers: z.string().min(2, { message: 'Organizer name must be at least 2 characters.' }),
  keywords: z.string().optional(), // For AI description generation
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function EventForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Default to today
    }
  });

  const eventNameForAI = watch('name');
  const keywordsForAI = watch('keywords');

  const onGenerateDescription = async () => {
    if (!eventNameForAI || !keywordsForAI) {
      toast({
        title: 'Missing Information',
        description: 'Please enter an event name and keywords to generate a description.',
        variant: 'destructive',
      });
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const result = await handleGenerateDescription(eventNameForAI, keywordsForAI);
      if (result.success && result.description) {
        setValue('description', result.description, { shouldValidate: true });
        toast({
          title: 'Description Generated',
          description: 'AI has populated the event description.',
        });
      } else {
        throw new Error(result.error || 'Unknown error generating description');
      }
    } catch (error: any) {
      toast({
        title: 'Error Generating Description',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const onSubmit: SubmitHandler<EventFormValues> = (data) => {
    try {
      const { keywords, ...eventData } = data; // Exclude keywords from event save data
      const newEvent = addEvent(eventData);
      toast({
        title: 'Event Created!',
        description: `"${newEvent.name}" has been successfully created.`,
      });
      router.push('/'); // Redirect to home page after creation
    } catch (error) {
      toast({
        title: 'Error Creating Event',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      console.error("Error creating event:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Create New Event</CardTitle>
        <CardDescription>Fill in the details below to create a new campus event.</CardDescription>
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
            <Label htmlFor="keywords">Keywords for AI Description (Optional)</Label>
            <Input id="keywords" {...register('keywords')} placeholder="e.g., technology, innovation, students, startups" />
            <p className="text-xs text-muted-foreground">Used with Event Name to generate description.</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">Event Description</Label>
              <Button type="button" variant="outline" size="sm" onClick={onGenerateDescription} disabled={isGeneratingDesc || !eventNameForAI || !keywordsForAI}>
                {isGeneratingDesc ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate with AI
              </Button>
            </div>
            <Textarea id="description" {...register('description')} placeholder="Describe the event..." rows={5} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting || isGeneratingDesc}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create Event
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
