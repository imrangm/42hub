import type { CampusEvent, EventAttendee } from '@/lib/types';

const EVENTS_STORAGE_KEY = 'campusHubEvents';

// Ensure functions are only called on the client side
const isClient = typeof window !== 'undefined';

export type NewEventPayload = Pick<CampusEvent, 'name' | 'date' | 'time' | 'location' | 'description' | 'organizers'> & { keywords?: string };

export function getEvents(): CampusEvent[] {
  if (!isClient) return [];
  const eventsJson = localStorage.getItem(EVENTS_STORAGE_KEY);
  return eventsJson ? JSON.parse(eventsJson) : [];
}

export function saveEvents(events: CampusEvent[]): void {
  if (!isClient) return;
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
}

export function addEvent(newEventData: NewEventPayload): CampusEvent {
  if (!isClient) throw new Error("Cannot add event on server.");
  const events = getEvents();
  const fullEvent: CampusEvent = {
    id: crypto.randomUUID(),
    attendees: [],
    name: newEventData.name,
    date: newEventData.date,
    time: newEventData.time,
    location: newEventData.location,
    description: newEventData.description,
    organizers: newEventData.organizers,
  };
  events.push(fullEvent);
  saveEvents(events);
  return fullEvent;
}

export function getEventById(id: string): CampusEvent | null {
  if (!isClient) return null;
  const events = getEvents();
  return events.find(event => event.id === id) || null;
}

export function registerForEvent(eventId: string, attendeeName: string, attendeeEmail: string): boolean {
  if (!isClient) return false;
  const events = getEvents();
  const eventIndex = events.findIndex(event => event.id === eventId);

  if (eventIndex === -1) {
    return false; // Event not found
  }

  const newAttendee: EventAttendee = { 
    id: crypto.randomUUID(),
    name: attendeeName, 
    email: attendeeEmail 
  };
  
  // Prevent duplicate registration by email for the same event
  const isAlreadyRegistered = events[eventIndex].attendees.some(att => att.email === attendeeEmail);
  if (isAlreadyRegistered) {
    return false; // Already registered
  }

  events[eventIndex].attendees.push(newAttendee);
  saveEvents(events);
  return true;
}

export function updateEvent(updatedEvent: CampusEvent): boolean {
  if (!isClient) return false;
  const events = getEvents();
  const eventIndex = events.findIndex(event => event.id === updatedEvent.id);

  if (eventIndex === -1) {
    return false; // Event not found
  }

  events[eventIndex] = updatedEvent;
  saveEvents(events);
  return true;
}

export function deleteEvent(id: string): boolean {
  if (!isClient) return false;
  let events = getEvents();
  const initialLength = events.length;
  events = events.filter(event => event.id !== id);
  if (events.length < initialLength) {
    saveEvents(events);
    return true;
  }
  return false;
}

