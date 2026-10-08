import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Case studies. One Markdown file per case in src/content/work/.
 * Body sections follow the template from the brief:
 * The situation, My role, The lens I brought, Decisions I made,
 * What happened, What I'd do differently.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    summary: z.string(),
    role: z.string(),
    status: z.string(),
    /** "Working prototype" cases must say so (brief rule) */
    prototype: z.boolean().default(false),
    lenses: z.array(
      z.enum(['Product', 'Marketing & CRM', 'Platform & CMS', 'Project Delivery', 'Web']),
    ),
    facts: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    tone: z.enum(['orchid', 'peach', 'purple', 'deep', 'lilac', 'merge']).default('purple'),
    order: z.number(),
  }),
});

export const collections = { work };
