function formatICSDate(date: Date): string {
  // Extract the local date parts
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Format as YYYYMMDDTHHmmSS
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
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