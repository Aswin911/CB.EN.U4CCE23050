```markdown
# Notification System Design

## Stage 1

### Overview

Honestly the problem is pretty simple to understand. There are way too
many notifications coming in everyday and students just cant keep up.
A placement alert and a farewell event notification look the same on
screen, which doesnt make sense. Something that could affect your
career shouldnt be buried under event updates.

So the ask was to build a Priority Inbox — basically always show the
most important notifications at the top. I defaulted to top 10 but
wrote the logic in a way where you can pass any number and it works.

### How I thought about it

Two things determine how important a notification is — what type it is
and how recent it is. I gave more importance to the type because thats
what actually matters. A placement notification from yesterday is still
more important than an event happening right now.

The scoring formula I used:

```
score = typeWeight + recencyScore
```

**Type weights:**

| Type      | Weight |
|-----------|--------|
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

**Recency score:**

```
recencyScore = Math.max(0, 1 - ageInMs / 86400000)
```

86400000 is just 24 hours in milliseconds. A notification that just
came in gets a recency score close to 1. Something thats a day old
gets 0. Anything older than that also gets 0, its clamped.

So the total score any notification can get is somewhere between 0 and 4.

### Why this actually works

Since typeWeight is always 1, 2 or 3 (a whole number) and recency is
always between 0 and 1, the type will almost always dominate. A
Placement will beat a Result, a Result will beat an Event. Recency only
really matters when two notifications are of the same type — in that
case the newer one wins.

The only edge case is when a Placement is more than 24hrs old and a
fresh Result comes in. The Placement score drops to exactly 3 and the
Result can go upto 3 as well. They basically tie. But thats an
acceptable tradeoff — a day old placement is still relevant.

### Keeping top 10 efficient as new notifications come in

This was an interesting part of the question. Right now the script just
fetches everything, scores it, sorts it and picks top 10. That works
fine for the current scale.

But if notifications are streaming in continuously and we want to
maintain top 10 without resorting everything everytime, the right
approach is a **min-heap of size k (where k=10)**:

- Start by inserting the first 10 scored notifications into the heap
- The heap always keeps the lowest score at the root
- When a new notification comes in, compute its score
- If its higher than the current minimum in the heap, remove the min
  and insert the new one
- If its lower, just discard it

This way you always have exactly the top 10 in memory. Time complexity
drops from O(n log n) to O(n log k) which is significantly better when
n is large and k stays small at 10.

I didnt implement this with a database since the question specifically
said DB queries are out of scope. But this is how i'd approach it in
a production setup with a real stream.

### Files written

| File | Purpose |
|------|---------|
| `notification_app_fe/src/utils/priorityEngine.ts` | Scoring and ranking logic |
| `notification_app_fe/src/stage1.ts` | Fetches notifications, runs priority, prints top 10 |
| `logging_middleware/src/logger.ts` | The Log() function |
| `logging_middleware/src/index.ts` | Exports Log() |

### How to run it

```bash
# build logging middleware first
cd logging_middleware
npm install
npm run build
cd ..

# install deps in fe folder
cd notification_app_fe
npm install axios dotenv ts-node

# run the stage 1 script
npx ts-node --skip-project --transpile-only src/stage1.ts
```

### Screenshot

Output screenshot is in `screenshots/stage1_output.png`, shows all
10 ranked notifications with their scores.
```