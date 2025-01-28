import type { CollectionEntry } from 'astro:content';

export function getEventNumber(post: CollectionEntry<'blog'>, yearPosts: CollectionEntry<'blog'>[]) {
  // Only number posts in category "stammtisch"
  if (post.data.categories !== 'stammtisch') {
    return null;
  }

  // Get year from event_date or filename for TBD dates
  const postYear = post.data.event_date instanceof Date 
    ? post.data.event_date.getFullYear()
    : parseInt(post.slug.split('-')[0]);

  // Filter and sort stammtisch posts for the year
  const yearStammtisch = yearPosts
    .filter((p) => 
      p.data.categories === 'stammtisch' && 
      (p.data.event_date instanceof Date 
        ? p.data.event_date.getFullYear() === postYear
        : parseInt(p.slug.split('-')[0]) === postYear),
    )
    .sort((a, b) => {
      // If both have dates, sort by date
      if (a.data.event_date instanceof Date && b.data.event_date instanceof Date) {
        return a.data.event_date.getTime() - b.data.event_date.getTime();
      }
      // TBD dates go to the end of their year
      if (!(a.data.event_date instanceof Date)) return 1;
      if (!(b.data.event_date instanceof Date)) return -1;
      return 0;
    });

  return yearStammtisch.findIndex((p) => p.id === post.id) + 1;
}

export function formatTitle(post: CollectionEntry<'blog'>, eventNumber: number | null) {
  if (eventNumber === null) {
    return post.data.title;
  }

  const year = post.data.event_date instanceof Date 
    ? post.data.event_date.getFullYear()
    : parseInt(post.slug.split('-')[0]);

  // Remove any existing numbering pattern if present
  const baseTitle = post.data.title
    .replace(/\s*#\d+\s*-\s*\d{4}$/, '')  // Remove "#X - YYYY" pattern from end
    .replace(/\s*-\s*\d{4}$/, '');         // Remove "- YYYY" pattern from end

  return `${baseTitle} #${eventNumber} - ${year}`;
} 