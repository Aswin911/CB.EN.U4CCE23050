# Notification System Design

## Stage 1

### Overview

So the problem here is pretty straightforward. The campus notification
system gets a lot of notifications everyday and users are simply
loosing track of whats important. Placements are critical, results
matter, events are the least urgent. But they all show up the same way
and thats the issue.

The product manager asked us to build a Priority Inbox that always
shows the top 'n' most important notifications first. I went with n=10
as the default but the logic supports any value.

### How I approached it

I decided to score each notification using two things - its type and
how recent it is. Both matter, but type matters more.

The formula I came up with:
score = typeWeight + recencyScore

**Type weights:**

| Type | Weight |
|------|--------|
| Placement | 3 |
| Result | 2    |
| Event | 1 |

Placement gets the highest weight because from a student's perspective,
a placement notification is always more critical than knowing about some
event happening on campus.

**Recency score:**
recencyScore = Math.max(0, 1 - ageInMs / 86400000)

86400000 is just 24 hours in milliseconds. So a notification thats just
arrived gets a recency score close to 1. Something thats 24 hours old
gets 0. Anything older than a day doesn't get recency bonus at all.

This means the total score for any notification falls between 0 and 4.

### Why this formula works

The type weight is always a whole number (1, 2, or 3) and the recency
score is always between 0 and 1. This is intentional.

It means type always dominates. A Result notification (score atleast 2)
will always rank above an Event notification (score maximum 2) unless
the Event is brand new and the Result is more than 24hrs old — in which
case they're very close and recency breaks the tie.

A Placement will always beat a Result. Thats by design because thats
what actually matters to students.

### Handling new notifications coming in

Since notifications keep coming in continuously, I'm not storing
anything in a database or caching it. Every time the priority function
runs, it fetches fresh data from the API and recomputes scores from
scratch.

This way the top 10 list is always up to date. A new Placement that
just came in will immediately appear at the top because it has
typeWeight=3 and recencyScore≈1, giving it nearly the highest possible
score of ~4.

No stale data. No manual refresh logic needed. Just re-run and you
get the current top 10.

### What the output looks like

The script fetches all notifications, scores each one, sorts them in
descending order of score, and prints the top 10 with their rank,
type, message, timestamp and score.

Screenshots of the output are in the `/screenshots` folder.

### Implementation details

- Language used: TypeScript
- Data source: GET `/evaluation-service/notifications` (live API, protected route)
- No hardcoding of notifications
- No database queries
- The logic is inside `notification_app_fe/src/utils/priorityEngine.ts`
- Logging is done via the `logging_middleware` Log() function throughout