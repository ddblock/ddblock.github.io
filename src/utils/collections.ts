import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

type FilterType = 'tag' | 'category';
type Post = CollectionEntry<'blog'>;

function parseArrayField(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map((s: string) => s.trim());
  return [];
}

export async function getFilteredPaths(filterType: FilterType) {
  const posts = await getCollection('blog');
  const filterKey = filterType === 'tag' ? 'tags' : 'categories';
  
  // Get all unique items
  const items = [...new Set(
    posts.flatMap((post: Post) => parseArrayField(post.data[filterKey])),
  )];

  return items.map((item: string) => ({
    params: { [filterType]: item },
    props: { 
      posts: posts.filter((post: Post) => 
        parseArrayField(post.data[filterKey]).includes(item),
      ),
    },
  }));
} 