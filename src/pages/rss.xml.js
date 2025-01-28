import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description || '',
      pubDate: post.data.date,
      link: `/blog/${post.slug}/`,
      // Optional fields
      categories: [post.data.categories, ...(post.data.tags || [])],
      content: post.data.event_date instanceof Date 
          ? `Event Date: ${post.data.event_date.toLocaleDateString('de-DE')}${post.data.event_location_name ? ` at ${post.data.event_location_name}` : ''}`
          : post.data.event_date === 'TBD' 
              ? 'Event Date: To be determined'
              : '',
    })),
  });
}
