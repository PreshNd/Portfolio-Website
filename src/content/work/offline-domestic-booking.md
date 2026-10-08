---
title: Offline Domestic Flight Booking
subtitle: Selling the airlines we hadn't integrated yet.
summary: Only two domestic airlines could be booked online. I proposed a booking request on the search results so customers could ask for the others, built the tracking myself, and our team booked them offline. 30,000+ unique bookings in year one.
role: Proposed it, supported the early build, then owned it
status: Launched. Later taken down when email delivery broke.
lenses: [Product, Project Delivery]
facts:
  - value: '60,000+'
    label: total requests, year one
  - value: '30,000+'
    label: unique bookings, year one
  - value: '₦9M+'
    label: revenue, year one
tone: orchid
order: 3
---

## The situation

Customers could book only two domestic airlines directly on the website. We could sell more airlines than that, but they weren't integrated yet. With no API connection, there was no online booking flow for them.

Customers who wanted those airlines had to call us or message us on WhatsApp.

## My role

The idea started with me. I supported the early build as Technical Product Coordinator, then owned the product as Associate Product Manager.

## The lens I brought

A search results page is where a customer decides. If the airline they want can't be booked, that page shouldn't be a dead end. And I knew our team could already book these airlines offline.

## Decisions I made

- **Use what we already had.** The team could already make these bookings offline through the merchant dashboard. The missing piece was getting the customer's request to them.
- **Put the request where the decision happens.** On the search results page, customers saw the airlines they could book and, alongside them, prices from the other airlines with a way to send a booking request. Over time I improved the form until it captured nearly the same details as the normal booking search.
- **Build the tracking myself.** There was no engineering time for a dashboard. The simplest thing the front end could do was send every request to an email inbox, so I wrote my first Google Apps Script, with ChatGPT's help. It read the inbox every 15 minutes and broke each request into rows on a sheet. One tab kept every request, so we could count demand. A second tab removed duplicates, and that was where the team worked. It let us start, and prove the idea, without waiting.
- **Set the bar for fulfilment.** Requests came in faster than they were being closed, so I wrote SLAs for how quickly each one should be handled.

## What happened

In its first year, the product brought in more than 60,000 total requests, more than 30,000 unique bookings and more than ₦9M in revenue. That was revenue from airlines we couldn't yet sell online.

Later, email delivery from the form broke. The engineer who had built it had moved on, with no handover, and it took months just to trace where the code lived. Customers were sending requests that never arrived. We took the form down rather than keep making a promise we couldn't keep. It did not come back.

## What I learned

**When there's no dev time, build the smallest thing that works.** A script and a sheet were enough to launch, measure demand and prove the idea.

**A request is only half a product.** The other half is the people who fulfil it. Next time, I'd push for fulfilment capacity to be planned in from day one, alongside operations, not after the requests arrive.

**Handover is part of done.** If no one knows where the code lives, the product is one departure away from breaking. I now treat documentation and handover as part of shipping, for every team I work with.

**Knowing when to stop is a product decision too.** Taking it down protected customers and the company's reputation. That mattered more than keeping a feature alive.
