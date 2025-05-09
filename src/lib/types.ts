
export interface EventAttendee {
  id: string;
  name: string;
  email: string;
}

export interface CampusEvent {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  description: string;
  organizers: string; // Could be a comma-separated string or an array of names
  attendees: EventAttendee[];
  // Optional fields for AI content generation
  keywords?: string; 
  generatedDescription?: string;
  generatedSocialMediaPost?: string;
  generatedEmailSnippet?: string;
}
