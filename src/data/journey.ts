/**
 * The Journey: the five lenses that built Chi.
 * Words come from Chi (voice note, 6 Oct 2026). Roles and dates live on the
 * CV and Work pages, not here. Edit freely: the page reads from this file.
 */
import type { Tone } from '../components/space/Planet.astro';

export type Stop = {
  id: string;
  lens: string;
  tone: Tone;
  ringed?: boolean;
  body: string;
  see: string;
  carried: string[];
};

export const intro = {
  title: 'Walk my journey with me.',
  lede: 'Five lenses have shaped the way I work, and each one still informs every product decision I make.',
};

export const stops: Stop[] = [
  {
    id: 'web',
    lens: 'Web building',
    tone: 'orchid',
    body: 'Building websites taught me what is genuinely buildable, so I scope honestly. It also taught me that UI and UX work hand in hand, and that a page is the moment a customer decides whether to act.',
    see: 'I build so nobody leaves a page without making a decision.',
    carried: ['UI & UX', 'WordPress', 'SEO'],
  },
  {
    id: 'crm',
    lens: 'CRM',
    tone: 'peach',
    body: 'CRM taught me to see the whole customer journey, from the first touchpoint, whether word of mouth or a search online, to the customer they eventually become: one-off, returning or loyal.',
    see: 'I ask what happens after the sale, so no customer falls through the cracks.',
    carried: ['Journeys', 'Lifecycle', 'Retention'],
  },
  {
    id: 'cms',
    lens: 'CMS',
    tone: 'purple',
    body: 'Managing the CMS showed me that a page is neither where the journey begins nor where it ends. SEO brings us in front of the customer, and behind every page is someone responsible for what that customer sees.',
    see: 'I look at who lives with the tool every day, and make their work easier.',
    carried: ['SEO', 'Landing pages', 'A/B tests'],
  },
  {
    id: 'coordination',
    lens: 'Product coordination',
    tone: 'deep',
    body: 'As a product coordinator, I translated between the people who sell a product, the people who build it, the people who use it and the people who own it. Each group speaks a different language, yet they share one goal.',
    see: 'I align everyone around the goal, and make sure everyone gets a piece of the cake.',
    carried: ['Stakeholders', 'UAT', 'Delivery'],
  },
  {
    id: 'product',
    lens: 'Product management',
    tone: 'merge',
    ringed: true,
    body: 'Product management is where every lens comes together. I ask the question that matters most, whether this truly solves the problem, and then I drive the work from start to finish.',
    see: 'The customer, the business and the team running it should all win.',
    carried: ['Discovery', 'Delivery', 'Outcomes'],
  },
];

export const finale = {
  title: 'Everyday buddies.',
  body: 'This is what all five lenses add up to: products that feel like a trusted companion. They understand what you are going through, and they solve problems you may not have thought to ask about.',
};
