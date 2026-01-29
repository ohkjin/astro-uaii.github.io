import type { CalendarEvent } from './calendarTypes';

export function filterEventsByCategory(
  events: CalendarEvent[],
  category: string
): CalendarEvent[] {
  if (category === 'all') return events;

  return events.filter(({ extendedProps }) => {
    if (category === 'press') {
      return extendedProps.type === 'press';
    }

    if (category === 'others') {
      return (
        extendedProps.type === 'event' &&
        ['exhibition', 'award', 'hackathon'].includes(
          extendedProps.category ?? ''
        )
      );
    }

    return (
      extendedProps.type === 'event' &&
      extendedProps.category === category
    );
  });
}