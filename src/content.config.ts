import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const resumeCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/resume' }),
  schema: z.object({
    period: z.string(),
    stack: z.array(z.string()).optional(),
  }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      summary: z.string().optional(),
      tags: z.array(z.string()).optional(),
      date: z.coerce.date(),
      image: image().optional(),
    }),
});

export const collections = {
  resume: resumeCollection,
  blog: blogCollection,
};
