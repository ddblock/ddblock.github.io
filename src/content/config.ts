import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		event_date: z.coerce.date(),
		event_location_name: z.string(),
		event_location_url: z.string(),
		categories: z.string()
			.transform(val => val.split(',').map(s => s.trim()))
			.optional(),
		tags: z.string()
			.transform(val => val.split(',').map(s => s.trim()))
			.optional(),
		draft: z.boolean().optional(),
		description: z.string().optional(),
	}),
});

export const collections = { blog }; 