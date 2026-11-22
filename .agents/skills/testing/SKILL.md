---
name: testing
description: Write and run FixIt Campus tests (Angular unit tests for a service and a component, API endpoint checks). Use to add or fix tests.
---

# testing

## Requirements from the assignment
- At least one service tested (e.g. TicketService with HttpTestingController)
- At least one component tested (e.g. ticket-card: inputs displayed, output emitted)

## Method
1. Frontend: ng test --watch=false; one .spec.ts file next to the tested file.
2. Arrange / Act / Assert structure, one behavior per test, explicit names.
3. Test the custom validator: critical priority + description under 30 characters -> invalid.
4. Test computed (counters per status) on a fixed set of tickets.
5. Backend: check each CRUD route (codes 200/201/400/404) via Swagger or curl.
6. Never delete or weaken a test to make it pass: fix the code.
7. Summarize at the end: tests added, result, what is still uncovered.