function formatICSDate(date: Date): string {
  // Convert to UTC for iCalendar format
  // We need to preserve the original time in the user's timezone
  // but format it according to iCalendar specs (UTC/Z format)
  const userTimezoneDate = new Date(date);
  return userTimezoneDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function generateICS(event: {
  title: string;
  startDate: Date;
  location: string;
  locationUrl: string;
  description?: string;
}) {
  // Events are typically 2 hours long
  const endDate = new Date(event.startDate.getTime() + 2 * 60 * 60 * 1000);

  const description = [
    event.description,
    `Location: ${event.location}`,
    `Google Maps: ${event.locationUrl}`,
  ].filter(Boolean).join('\\n\\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatICSDate(event.startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
} 