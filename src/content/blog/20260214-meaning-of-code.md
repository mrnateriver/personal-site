---
title: 'Meaning of Code'
summary: 'Focus on value, not code —- until the implementation’s risks, trade-offs, and failure modes become your problem. LLMs make changes cheaper, but they don’t erase security cliffs or accumulated liabilities. Code matters because it determines the cost when things break.'
oneliner: 'Value comes first, but code sets the bill when reality shows up.'
tags: ['AI', 'Software Engineering', 'Programming']
date: '2026-02-14'
---

The advent of AI gave rise to self-proclaimed “Outcome Engineering,” complete with its own [manifesto](https://o16g.com/). The short version: forget about code, focus on value.

Of course you should focus on value. Code is nothing more than a tool we use to make [stones think](https://www.goodreads.com/quotes/773006-it-is-well-known-that-stone-can-think-because-the). Think about how many ways there are to write the same program: different languages, platforms, and stacks. Keep that in mind, because the next time you cook on a modern stove with a microcontroller, commute to work on a train packed with electronic systems, or cross the road at a traffic light controlled by software, you won’t be thinking about how the code was written. These things are so integral to modern life that the abstraction rises all the way up to one’s sight, hiding how they work, let alone the cleanliness or soundness of the underlying code.

Code can have meaning in an isolated context. Any configuration for a program is a kind of code that is interpreted by that software, even if such code is not Turing complete (although [sometimes you'd be shocked](https://www.youtube.com/watch?v=uNjxe8ShM-8)). You might think it is an artifact in and of itself. However, the sole purpose of configuration, by definition, is changing the behavior of a program, and if you are given two programs that behave identically, would you pick the one that requires configuration? Presumably not, because given identical value, required configuration is an extra price. Ultimately, you would still be focusing on value rather than the underlying code.

Code exists to solve a particular problem. But it is the _solution_ you look for, not the _code_.

So the code does not matter.

---

Until it suddenly does.

It has never been about the code as a sequence of characters -- as words or sentences. The idiosyncrasies you use as instructions for your program are transient; they are merely projections of common sense, and [sometimes not even that](https://arxiv.org/pdf/1904.09828). Programming is taking a snapshot of that sense and projecting it onto the tool of choice.

The value you pursue is not free. You can accept some risks and trade-offs to minimize [the price of that value](https://hai.stanford.edu/ai-index/2025-ai-index-report/economy), but the risks and trade-offs themselves are directly derived from the implementation.

The engine of a car does not matter when you are getting to your destination -- until it breaks, and it is your car and your engine, and you suddenly have to deal with this new problem. You got the value out of the car, and now you have to pay the price. The risk of that happening, the price of the fix, and the time it would take -- all of those characteristics are derived from the car’s engine.

Of course it is not about the code. As long as the code is perfect, you can trust it and you are never going to change it. LLMs drastically reduce the price of change. But some aspects of software, like security, [do not tolerate gradual improvement](https://www.theregister.com/2024/03/28/ai_bots_hallucinate_software_packages/). The reduced price of change, together with the price of security incidents, accumulates as debt with interest. And before LLMs reach AGI levels, the moment LLM runs out of steam and is unable to solve a problem is inevitable, and you will always have to pay the debt in full at once at some point.

The code matters, as long as it exists.
