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
  lede: 'Five lenses shaped how I work. Each one still sits inside every product decision I make.',
};

export const stops: Stop[] = [
  {
    id: 'web',
    lens: 'Web building',
    tone: 'orchid',
    body: "I know what's actually buildable, so I scope honestly. I also know that UI and UX speak to each other. A page is the space where a customer decides whether to act.",
    see: 'I build so nobody leaves a page without making a decision.',
    carried: ['UI & UX', 'WordPress', 'SEO'],
  },
  {
    id: 'crm',
    lens: 'CRM',
    tone: 'peach',
    body: 'I learned to see the whole customer journey. From the first touch point, word of mouth or the internet, to who they become: a one-off, a returning or a loyal customer.',
    see: 'I ask what happens after the sale, so no customer falls through the cracks.',
    carried: ['Journeys', 'Lifecycle', 'Retention'],
  },
  {
    id: 'cms',
    lens: 'CMS',
    tone: 'purple',
    body: 'A page is not where the journey starts or ends. SEO puts us in front of the customer. And behind every page, someone manages what that customer sees.',
    see: 'I look at who lives with the tool every day, and make their work easier.',
    carried: ['SEO', 'Landing pages', 'A/B tests'],
  },
  {
    id: 'coordination',
    lens: 'Product coordination',
    tone: 'deep',
    body: 'I translate between the people who sell a product, the people who build it, the people who use it and the people who own it. Different languages, one goal.',
    see: 'I align everyone around the goal, and make sure everyone gets a piece of the cake.',
    carried: ['Stakeholders', 'UAT', 'Delivery'],
  },
  {
    id: 'product',
    lens: 'Product management',
    tone: 'merge',
    ringed: true,
    body: 'I bring every lens together and ask the question that matters: does this actually solve the problem? Then I drive it from start to finish.',
    see: 'The customer, the business and the team running it should all win.',
    carried: ['Discovery', 'Delivery', 'Outcomes'],
  },
];

export const finale = {
  title: 'Everyday buddies.',
  body: 'That is what all five lenses add up to. Products that feel like a buddy: they know what you are going through, and they solve what you might not have thought to ask.',
};
