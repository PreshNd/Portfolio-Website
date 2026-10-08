---
title: E-FIRS Compliance and e-Invoicing
subtitle: Turning bookings into invoices the tax authority accepts.
summary: I led the requirements for our mandatory FIRS e-invoicing integration, turned booking and revenue data into a clean invoice model, and got Finance, Engineering and an outside vendor speaking the same language. It went live.
role: Product Lead
status: Live. The first invoices were submitted and approved.
lenses: [Product, Project Delivery]
facts:
  - value: 'Live'
    label: first invoices approved
  - value: '3'
    label: teams aligned on one data model
tone: deep
order: 4
---

## The situation

Nigeria's tax authority, FIRS, made electronic invoicing mandatory. Every sale had to become a structured invoice, sent to the government in the format it expects.

Our sales didn't start life as invoices. They lived across booking, revenue and financial systems, each built for its own job.

## My role

I was the Product Lead, and the requirements were mine end to end. The global product team left it in my hands because they trusted I understood it best.

## The lens I brought

I had never worked in finance. But over the years I'd picked up how a booking really moves through our systems: from the internal control system where operations manage every booking, to the data our data team keeps, to what Finance needs at the end. Nobody sat me down to teach me. I learned it by being curious, doing QA and helping people solve problems.

That knowledge became the map. The same data meant different things to Finance, Engineering and our outside vendor. My job was to find the one version all three could trust.

## Decisions I made

- **I mapped it myself.** Finance was deep in audit season, so much of the mapping fell to me. I worked with our data team to line up every invoice item against the booking records: what was charged, what was deducted, and where commission and markups sat.
- **I designed the invoice data model.** I translated our booking, revenue and financial data into a structured invoice model, covering payment reconciliation and the transaction data the government needs.
- **I defined the transformation rules.** How commission is handled, how VAT is mapped, and how the base fare is adjusted, so every invoice adds up.
- **I made reconciliation part of the design.** The rules let Finance reconcile our invoices accurately against the money that actually came in.
- **I aligned three teams on one picture.** Finance, Engineering and the vendor each described the same data differently. I sat with Finance until they saw what I was seeing, and brought everyone to one shared model.
- **I held my own with the vendor.** In meetings with the access point provider, I knew the data well enough to answer their questions and to ask the right ones.
- **I used AI carefully.** I used ChatGPT to check my thinking, ask questions and simulate mock data, so no real customer data was ever exposed.

## What happened

Testing was completed, and the first set of invoices was submitted and approved. The integration went live.

## What I learned

**Knowledge compounds.** Years of quietly learning how operations, bookings and data work became the thing that made this possible. Curiosity is never wasted.

**Every department is a user.** In every product I build, I ask what each team needs from it. Finance needed a reconciliation view in the agent portal, and a way to trace offline payments to booking requests. On E-FIRS, Finance wasn't one of the users. They were the customer.

**Know when to step in, and when to push back.** I'm quick to pick up work that isn't mine when a project is at risk. My manager often warned me about scope creep. On E-FIRS, stepping in got us live. I'm still learning to push back sooner, so the right owner carries the right work.
