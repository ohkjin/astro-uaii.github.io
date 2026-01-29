import FullCalendar from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';

import type { CalendarEvent } from '@/lib/calendarTypes';

let calendar: FullCalendar;
let allCalendarEvents: CalendarEvent[] = [];
let activeCategory = 'all';

/* ---------------- filtering ---------------- */

function filterEventsByCategory(
  category: string
): CalendarEvent[] {
  if (category === 'all') return allCalendarEvents;

  return allCalendarEvents.filter(({ extendedProps }) => {
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

/* ---------------- calendar update ---------------- */

function updateCalendarEvents(): void {
  const filtered = filterEventsByCategory(activeCategory);
  calendar.removeAllEvents();
  calendar.addEventSource(filtered);
}

/* ---------------- init ---------------- */

export function initCalendar(
  events: CalendarEvent[]
): void {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;

  allCalendarEvents = events;

  calendar = new FullCalendar(calendarEl, {
    plugins: [dayGridPlugin, multiMonthPlugin],
    timeZone: 'UTC',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'multiMonthYear,dayGridMonth',
    },
    views: {
      multiMonthYear: {
        type: 'multiMonth',
        duration: { months: 6 },
        buttonText: 'year',
        eventDisplay: 'block',
      },
    },
    navLinks: true,
    editable: false,
    dayMaxEvents: 3,
    moreLinkClick: 'popover',
    events: allCalendarEvents,

    eventContent(arg) {
      if (arg.view.type === 'multiMonthYear') {
        return { html: '' };
      }
      return {
        html: `<div class="fc-event-title">${arg.event.title}</div>`,
      };
    },

    eventClick(arg) {
      arg.jsEvent.preventDefault();
      const { type, id } = arg.event.extendedProps;

      if (!id) return;

      if (type === 'press') {
        window.location.href = `/press-detail?id=${id}`;
      } else {
        window.location.href = `/events-detail?id=${id}`;
      }
    },
  });

  calendar.render();
}

/* ---------------- category buttons ---------------- */

export function setupCategoryFilters(): void {
  document
    .querySelectorAll<HTMLButtonElement>('.category-filter')
    .forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.category ?? 'all';
        updateCalendarEvents();
      });
    });
}