---
title: Offline Domestic Flight Booking
subtitle: Selling the airlines we had not yet integrated.
summary: Only two domestic airlines could be booked online. I proposed a booking request on the search results page so customers could ask for the others, built the tracking myself, and our team completed those bookings offline. It produced more than 30,000 unique bookings in its first year.
role: Proposed it, supported the early build, then owned it
status: Launched. Later retired when email delivery failed.
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

Customers could book only two domestic airlines directly on our website. We were able to sell many more, but those airlines were not yet integrated, and without an API connection there was no way to book them online.

Customers who wanted those airlines had to call us or message us on WhatsApp.

## My role

The idea was mine. I supported the early build as Technical Product Coordinator and then owned the product as Associate Product Manager.

## The lens I brought

The search results page is where a customer makes a decision. If the airline they want cannot be booked, that page should not be a dead end, and I knew our team could already book these airlines offline.

## Decisions I made

- **I used what we already had.** Our team could already make these bookings offline through the merchant dashboard. The missing piece was getting the customer's request to them.
- **I placed the request where the decision happens.** On the search results page, customers saw the airlines they could book alongside prices from the other airlines, with an option to send a booking request. Over time, I refined the form until it captured nearly the same details as a standard booking search.
- **I built the tracking myself.** There was no engineering capacity for a dashboard, and the simplest option for the front end was to send each request to an email inbox. So I wrote my first Google Apps Script, with help from ChatGPT. Every 15 minutes it read the inbox and broke each request into rows on a spreadsheet. One tab kept every request so we could measure demand, and a second tab removed duplicates and became the team's working list. It let us launch and prove the idea without waiting.
- **I set the standard for fulfilment.** Requests were arriving faster than they were being closed, so I wrote service-level agreements defining how quickly each one should be handled.

## What happened

In its first year, the product generated more than 60,000 requests, more than 30,000 unique bookings and over ₦9M in revenue, all from airlines we could not yet sell online.

Later, email delivery from the form failed. The engineer who had built it had moved on without a handover, and it took months simply to trace where the code lived. Customers were sending requests that never arrived, so we took the form down rather than keep making a promise we could not keep. It was not brought back.

## What I learned

**When there is no development time, build the smallest thing that works.** A script and a spreadsheet were enough to launch, measure demand and prove the idea.

**A request is only half a product.** The other half is the people who fulfil it. Next time, I would plan fulfilment capacity with operations from day one, not after the requests begin to arrive.

**Handover is part of done.** If no one knows where the code lives, a product is one departure away from breaking. I now treat documentation and handover as part of shipping, with every team I work with.

**Knowing when to stop is also a product decision.** Taking the form down protected our customers and the company's reputation, and that mattered more than keeping a feature alive.
