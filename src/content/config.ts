import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    event_date: z.union([
      z.coerce.date(),
      z.literal('TBD'),
    ]).optional(),
    event_location_name: z.string().optional(),
    event_location_url: z.string().url().optional(),
    categories: z.string(),
    tags: z.string().transform((str) => str.split(',').map((s) => s.trim())),
    description: z.string().optional(),
  }),
});

export const collections = {
  blog,
};
