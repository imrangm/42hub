
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { registerForEvent } from '@/lib/localStorage';
import { Loader2 } from 'lucide-react';

const registrationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

interface EventRegistrationFormProps {
  eventId: string;
  onSuccessfulRegistration: () => void; // Callback to update parent component state
}

export default function EventRegistrationForm({ eventId, onSuccessfulRegistration }: EventRegistrationFormProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit: SubmitHandler<RegistrationFormValues> = (data) => {
    const success = registerForEvent(eventId, data.name, data.email);
    if (success) {
      toast({
        title: 'Registration Successful!',
        description: `You have successfully registered for this event.`,
      });
      reset(); // Clear form fields
      onSuccessfulRegistration(); // Notify parent to re-fetch event data
    } else {
      toast({
        title: 'Registration Failed',
        description: 'You might already be registered, or an error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-name">Full Name</Label>
        <Input id="reg-name" {...register('name')} placeholder="John Doe" />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-email">Email Address</Label>
        <Input id="reg-email" type="email" {...register('email')} placeholder="john.doe@example.com" />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Register for Event
      </Button>
    </form>
  );
}
