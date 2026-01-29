import type { EventInput } from '@fullcalendar/core';


export type EventCategory =
| 'presentation'
| 'conference'
| 'workshop'
| 'seminar'
| 'meeting'
| 'exhibition'
| 'award'
| 'hackathon';


export interface CalendarExtendedProps {
id?: string;
type: 'press' | 'event';
category?: EventCategory;
place?: string;
speaker?: string;
participants?: string;
award?: string;
desc?: string;
links?: { label: string; url: string }[];
}


export interface CalendarEvent extends EventInput {
extendedProps: CalendarExtendedProps;
}