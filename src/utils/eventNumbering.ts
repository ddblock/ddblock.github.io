import type { CollectionEntry } from 'astro:content';

export function getEventNumber(post: CollectionEntry<'blog'>, yearPosts: CollectionEntry<'blog'>[]) {
  // Only number posts in category "stammtisch"
  if (post.data.categories?.toString() !== 'stammtisch' || !post.data.event_date) {
    return null;
  }

  // Filter and sort stammtisch posts for the year
  const yearStammtisch = yearPosts
    .filter((p) => 
      p.data.categories?.toString() === 'stammtisch' && 
      p.data.event_date &&
      new Date(p.data.event_date).getFullYear() === 
        new Date(post.data.event_date!).getFullYear(),
    )
    .sort((a, b) => {
      const dateA = new Date(a.data.event_date!).getTime();
      const dateB = new Date(b.data.event_date!).getTime();
      return dateA - dateB;
    });

  return yearStammtisch.findIndex((p) => p.id === post.id) + 1;
}

export function formatTitle(post: CollectionEntry<'blog'>, eventNumber: number | null) {
  if (eventNumber === null) {
    return post.data.title;
  }

  const year = new Date(post.data.event_date!).getFullYear();
  // Remove any existing numbering pattern if present
  const baseTitle = post.data.title
    .replace(/\s*#\d+\s*-\s*\d{4}$/, '')  // Remove "#X - YYYY" pattern from end
    .replace(/\s*-\s*\d{4}$/, '');         // Remove "- YYYY" pattern from end

  return `${baseTitle} #${eventNumber} - ${year}`;
} 