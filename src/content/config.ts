import { defineCollection, z } from 'astro:content';

const resumeCollection = defineCollection({
  type: 'content',
  schema: z.object({
    period: z.string(),
    stack: z.array(z.string()).optional(),
  }),
});

export const collections = {
  resume: resumeCollection,
};
