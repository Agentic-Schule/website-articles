---
title: 'Is This Still Vibe Coding? Or Just Good Craftsmanship?'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe is a trainer and consultant for modern web development. The workshops at <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> and <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> focus on Angular in practice – and increasingly on agentic development with AI agents like Claude Code.'
bioHeading: About the author
published: 2026-09-21
keywords:
  - Vibe Coding
  - Agentic Coding
  - Claude Code
  - AI-assisted Engineering
  - Code Review
  - Security
  - Evals
language: en
header: header.jpg
---

Vibe coding is either an insult or a compliment, depending on whom you ask. I have built an entire product this way, and my take is: it is both, just never at the same time.

**This double meaning holds the whole story of the term: As a compliment, vibe coding means the astonishing ease with which software gets built today. As an insult, it means unread AI code in production: software development as gambling, a roll of the dice. It may work out, but it doesn't have to. What Andrej Karpathy described as a throwaway weekend experiment has become the label for pretty much everything built with AI agents. Time to take the word apart and then show which techniques produce usable software even with an AI at the wheel.**

## Contents

[[toc]]

## From throwaway experiment to Word of the Year

On November 6, 2025, Collins Dictionary named "vibe coding" its [Word of the Year 2025](https://blog.collinsdictionary.com/language-lovers/collins-word-of-the-year-2025-ai-meets-authenticity-as-society-shifts/). The announcement reads like ad copy: "It’s programming by vibes, not variables. While tech experts debate whether it’s revolutionary or reckless, the term has resonated far beyond Silicon Valley, speaking to a broader cultural shift towards AI-assisted everything in everyday life."

The [dictionary entry](https://www.collinsdictionary.com/dictionary/english/vibe-coding) itself is remarkably tame: "the use of artificial intelligence prompted by natural language to assist with the writing of computer code", a slang noun, with the derived forms "vibe coder" and "vibe-code" as a verb. By that definition, all AI-assisted programming would be vibe coding. And that is exactly where the problem starts, because the original says something entirely different.

## What Karpathy actually wrote

The term comes from a single, by now very famous [X post by Andrej Karpathy](https://x.com/karpathy/status/1886192184808149383) from February 2025. Karpathy is a founding member of OpenAI, was head of AI at Tesla, and nowadays explains neural networks on YouTube as one of the field's most popular teachers. When he gives a way of working a name, the industry listens. The opening, verbatim:

> "There's a new kind of coding I call "vibe coding", where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."

And then it gets concrete. Karpathy describes what that means in practice: "I "Accept All" always, I don't read the diffs anymore." He pastes error messages back into the chat without comment. The code grows "beyond my usual comprehension". And when a bug won't go away, he asks for random changes until it does. His own verdict is in the same post: "It's not too bad for throwaway weekend projects, but still quite amusing." And: "it's not really coding - I just see stuff, say stuff, run stuff, and copy paste stuff, and it mostly works."

So the original is refreshingly clear: vibe coding means deliberately **not** reading the code. It is an experiment in giving up control, meant for throwaway projects. Karpathy never turned it into a production methodology.

## The dilution and the pushback

What happened next is familiar to anyone following the industry: the term exploded, and suddenly everything was called vibe coding, from the weekend prototype to professional agent-driven development. The most prominent opponent of this dilution is Simon Willison, co-creator of the Django web framework and one of the most widely read chroniclers of the LLM scene. As early as March 19, 2025, he made clear in ["Not all AI-assisted programming is vibe coding (but vibe coding rocks)"](https://simonwillison.net/2025/Mar/19/vibe-coding/) how he understands the term: "When I talk about vibe coding I mean building software with an LLM without reviewing the code it writes." His dividing line is the best sentence of the entire debate:

> "If an LLM wrote the code for you, and you then reviewed it, tested it thoroughly and made sure you could explain how it works to someone else that’s not vibe coding, it’s software development. The usage of an LLM to support that activity is immaterial."

Plus his golden rule: "My golden rule for production-quality AI-assisted programming is that I won’t commit any code to my repository if I couldn’t explain exactly what it does to somebody else."

How seriously Willison means it shows in an episode from May 2025: Under the title ["Two publishers and three authors fail to understand what “vibe coding” means"](https://simonwillison.net/2025/May/1/not-vibe-coding/) he criticized two announced tech books that used the term as a synonym for all AI programming. Apparently it had an effect: the book by Addy Osmani of Google's Chrome team was originally titled "Vibe Coding: The Future of Programming" and shipped as ["Beyond Vibe Coding: From Coder to AI-Era Developer"](https://beyond.addy.ie/). Willison's comment: "This title is so much better." Osmani himself now writes: "Vibe coding was never meant to describe all AI-assisted coding. It's a specific approach where you don't read the AI's code before running it." His counter-term is *AI-assisted engineering*: "a more structured approach that combines the creativity of vibe coding with the rigor of traditional engineering practices." And for the cases where it goes wrong, his book page has the finest sentence of all: **"Vibe coding is fun until you start leaking database credentials."**

In October 2025, Willison [proposed a counter-term of his own](https://simonwillison.net/2025/Oct/7/vibe-engineering/). His image for the practice without guardrails is the dice cup: "Vibe coding is irresponsibly building software through dice rolls, not caring what code is produced." For the other end of the spectrum he suggested: "I propose we call this vibe engineering, with my tongue only partially in my cheek." Meaning "a different, harder and more sophisticated way of working with AI tools to build production software", self-irony included ("Is this a stupid name? Yeah, probably."). The evolution of the term kept going, by the way: an update from February 2026 in the same post notes that "Agentic Engineering" is winning out.

## And then the line blurs after all

The story has a third act, and it is what makes it truly interesting. In May 2026, Willison published ["Vibe coding and agentic engineering are getting closer than I’d like"](https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/) and confessed: "Weirdly though, those things have started to blur for me already, which is quite upsetting." The reason: "The problem is that as the coding agents get more reliable, I’m not reviewing every line of code that they write anymore, even for my production level stuff."

Of all people, the man who made reviewing a matter of definition no longer reads every line. He compares it to working in large organizations: you don't read the neighboring team's image resize service line by line either; you use it through its documentation and only look inside when something goes wrong. The difference, and he names it razor-sharp: "Claude Code does not have a professional reputation! It can’t take accountability for what it’s done." And he warns of the creeping habituation effect: "There’s an element of the normalization of deviance here—every time a model turns out to have written the right code without me monitoring it closely there’s a risk that I’ll trust it at the wrong moment in the future and get burned."

His hard limit still stands: "If you’re building software for other people, vibe coding is grossly irresponsible because it’s other people’s information. Other people get hurt by your stupid bugs."

<!--
## What the empirical evidence says

Beyond the opinions, there are measurements by now, and they urge caution. Three findings, each with its limits:

**AI code measurably contains vulnerabilities.** A [peer-reviewed analysis](https://arxiv.org/abs/2510.26103) (ICICS 2025) ran CodeQL over 7,703 AI-attributed files from public GitHub repos: 87.9% had no identifiable CWE vulnerabilities, which conversely means roughly one in eight files carried at least one finding, 4,241 CWE instances across 77 types in total. For context: over 90 percent of the corpus is ChatGPT code, the attribution is self-reported, and static analysis provides a lower bound.

**Autonomous iteration makes it worse.** A [second peer-reviewed study](https://arxiv.org/abs/2506.11022) (IEEE ISTAS 2025) had an LLM "improve" its own code in a loop, without any humans: after five iterations the authors counted 37.6% more critical vulnerabilities, and even explicitly security-focused prompting did not prevent the effect, it only softened it. The authors' recommendation is stated verbatim in the paper: "Restrict consecutive LLM-only iterations to 3 maximum", then human review and reset the counter. The limits apply here too: a single model (GPT-4o), only C and Java, and a deliberately constructed scenario without human intervention, which is pretty much vibe coding in the Karpathy sense.

**Code gets copied more and cleaned up less.** [GitClear's analysis](https://www.gitclear.com/ai_assistant_code_quality_2025_research) of 211 million changed lines of code (2020 to 2024) shows: the share of refactoring lines fell from 25% to under 10%, copy-paste rose from 8.3% to 12.3%, and for the first time more code was copied than moved. GitClear, however, sells code quality tooling and measures with a proprietary algorithm; the finding is a correlation over the timeline.

Important for context: none of these studies measures vibe coding in the narrow sense, i.e. unreviewed accepting. They measure AI-generated code in general, with models and data up to roughly mid-2025. The direction is clear nonetheless: without control, risk accumulates.
-->

## The techniques: AI at the wheel, you at the guardrail

So what does this mean concretely? The following guardrails make the difference between rolling dice and engineering. I have distilled them from the best available sources, from Willison's posts to Anthropic's official docs to peer-reviewed research, and battle-tested them in our own practice:

**1. Read the diffs.** The minimum rule, and the exact inversion of Karpathy's "I don't read the diffs anymore". Plus Willison's commit test: what you cannot explain, you do not commit.

**2. Give the agent a check.** The [official Claude Code docs](https://code.claude.com/docs/en/best-practices) put it perfectly: "Give Claude a check it can run: tests, a build, a screenshot to compare. It’s the difference between a session you watch and one you walk away from." Without a verifiable signal, you are the test bench yourself, verbatim: "you become the verification loop: every mistake waits for you to notice it." Tests, build exit codes, linters, and screenshot comparisons close the loop, very much in the spirit of my [loop article](https://agentic.schule/blog/2026-09-loop-engineering).

**3. Tests first.** Willison observes [in his vibe engineering post](https://simonwillison.net/2025/Oct/7/vibe-engineering/) that "LLMs actively reward existing top tier software engineering practices", automated tests above all: with a stable test suite the agents fly, and without one the agent happily claims something works without ever having checked. How to measure the quality of your instructions themselves instead of judging by gut feeling is covered in the [prompt and context article](https://agentic.schule/blog/2026-09-prompt-context-engineering): evals.

**4. Put a lid on the iterations.** A [peer-reviewed study](https://arxiv.org/abs/2506.11022) (IEEE ISTAS 2025) measured that code gets less secure when an LLM "improves" it in a loop without humans; its recommendation reads verbatim "Restrict consecutive LLM-only iterations to 3 maximum", then human review. A single-study guideline, but it matches everyday experience: when the agent optimizes on its own for too long, it rarely gets better. Look at it yourself in between.

**5. Limit the blast radius.** Anthropic relies on [sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing) in Claude Code, with filesystem and network isolation, explicitly also as protection against prompt injection. According to Anthropic, the defined boundaries reduce permission prompts by 84 percent in their internal usage; the agent works more freely and stays fenced in at the same time. The most consistent expansion stage: my agent has a computer of its own, as described in the [ground station article](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini).

**6. Have a second instance review.** Commands like `/code-review` and `/security-review` are an additional safety net. The view is only truly fresh, though, when sub-agents with their own context window are spawned for it; when that happens and why it makes the difference is covered in the [graph article](https://agentic.schule/blog/2026-09-graph-engineering). But always keep in mind: reviews do not replace your own reading, they complement it.

> **💡 Remember:** Who types the code is secondary. It only becomes good software when someone reads, tests, and takes responsibility. AI cannot take responsibility.

## How we build learnly.school

Time for an example from our own practice. Our learning platform [learnly.school](https://learnly.school) is 100 percent AI-written: no human typed the code, but every diff was read. (Unless I can't be bothered: for small stuff I genuinely enjoy changing the code myself. Like in the old days!) By the strict standards of Karpathy and Willison, that simply is not vibe coding anymore, that is software development. There is a solid reason for it: if a project is just for fun, then let it vibe! A school platform, however, processes real personal data, and YOLO simply does not fly there. Rolling the dice once and getting lucky may work out. As an entire software strategy, it would be a disaster waiting to happen. That is why we work with the established principles of software engineering.

![The learnly.school start page: learning paths, materials, and AI-supported learning companions in one place, with the fox mascot holding a map.](/img/flagships/learnly.webp "learnly.school: learning paths, materials, and AI-supported learning companions in one place. 100 percent AI-written.")

Behind the good vibes sits a whole workbench:

- **Layered custom prompts:** three `CLAUDE.md` files (project, backend, frontend) plus a central reference document, marked as required reading for every session. How these layers play together is covered in the [prompt and context article](https://agentic.schule/blog/2026-09-prompt-context-engineering).
- **Strict typing:** TypeScript everywhere, `any` is forbidden as a hard rule. The compiler is the cheapest reviewer there is.
- **Separated layers with a contract:** backend (NestJS, Drizzle ORM) and frontend (Angular) are cleanly separated, the API is documented via Swagger/OpenAPI, and the frontend client is generated from it. The documented workflow works its way from the bottom up: "Complete each layer fully before moving up." Database views hide complexity from the agent.
- **Vibe-compatible patterns:** deliberately simple, effective building blocks like `rxResource` instead of clever custom constructs. What the agent has seen often, it builds reliably. (I personally enforce [`rxResourceFixed`](https://angular.schule/blog/2025-10-rx-resource-is-broken#the-solution-rxresourcefixed-it-actually-works), my improved version of the original.)
- **Tests down to the smallest detail:** The classic testing pyramid stands: unit tests, integration tests, E2E tests against the real backend with a real Postgres database, the full program. Although the pyramid is a bit misshapen: writing E2E tests is temptingly easy and incredibly fast, Claude handles Playwright like a champion. Fine by me, then CI just takes a while! 😅
- **Personas as an ensemble:** A complete fictional school of personas (principal, office, subject teachers, students) regularly runs realistic journeys against the real app. This is realized with sub-agents: each gets its story and its task, does not know the code, and has to find its way around the UI without help. If it fails or complains (all of them have the mandate to report every inconsistency immediately), the software is bad. And the rule stands: "report only what you saw, never invented details".
- **Reviews as an institution:** regular `/code-review` and `/security-review` runs, and the findings flow back into the `CLAUDE.md` as dated hard rules.
- **The screenshot loop:** For visual tasks the rule is verbatim "render → look at it yourself → correct, never build blind". The agent produces screenshots and then sees for itself that something is off. How I gave my agent its own Playwright MCP for this is covered in the [Playwright MCP article](https://agentic.schule/blog/2026-09-agent-recherche-playwright-mcp).
- **Living documentation for the model:** `SPECS.md` describes the current state ("no wishful thinking"), `PROTOCOL.md` is the append-only logbook, `TODOS.md` the backlog. Decisions sit dated in the rules.
- **Backups, backups, backups.** Encrypted, it goes without saying.

## Never tell the AI about the pink elephant

One story deserves a special appearance, because it concerns a different layer: the AI **inside** the product. learnly.school ships learning companions that children chat with, and for an LLM, text is simply text, whether prose, prompt, or code. The [pink elephant rule](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini#ein-prinzip-erz%C3%A4hl-den-agenten-nie-vom-rosa-elefanten) 🐘 from the ground station article caught up with us here a second time, so I am happy to tell it again.

Step by step: One of our learning companions made a friendly, on-topic, and nevertheless dangerous suggestion on the subject of mushrooms ("shall we try how it tastes?"). Our first reaction was the obvious one: prohibitions into the prompts, with concrete examples of everything that is off limits. The result was a proper mess: the companions suddenly kept getting tangled up in mushrooms and dares that nobody had brought up, and the guard model in turn blocked even harmless things (a "math is stupid" got confiscated as a dangerous activity). It turned out: a "don't" was to blame for all of it. A prohibition with vivid examples is what brings the pink elephant into the context in the first place, and it never leaves.

![A pink elephant standing in a savanna landscape.](rosa-elefant.png "Whatever you do, do not think of the pink elephant!")

The consequence is a hard rule today: in everything that enters a model's context, vividly painted danger examples are forbidden. Categories are named abstractly and phrased positively ("stick to the learning tasks"). An integration test checks this literally: words like "Pilz" (mushroom) or "Mutproben" (dares) must not appear in any companion prompt, while the abstract category "dangerous activity" must be present. That is prompt engineering with evals, right in the middle of the product code.

And in case you think this only happens to small teams: [OpenAI published a post-mortem](https://decrypt.co/366197/openai-explains-chatgpt-mention-goblins) on why ChatGPT kept bringing up goblins unprompted for months. The "Nerdy" personality had rewarded fantasy-creature metaphors during training, up to the point where the model called bugs a "mischievous little gremlin", and the emergency brake was, of all things, a don't in the system prompt: "never talk about goblins". It happens to the pros too. Wrong priming, and pink elephants are everywhere.

And with that, back to software development, because the lesson applies there just as much: for heaven's sake, do not work with negative examples. That goes for prompts, and it goes for code. Which brings us to the topic of Clean Code: if the agent is supposed to produce good code, the repository has to contain clean code. For a human, you can maybe drop a `// FIXME: bad code, remove this later` and they leaf past it, shaking their head. With an LLM you have a huge problem: it has read the mess. Lousy code is a giant pink elephant. Or to repeat my quote from the [prompt and context article](https://agentic.schule/blog/2026-09-prompt-context-engineering):

> **Clean Code is not dead. It's context engineering now.**
>
> — Johannes Hoppe

## Conclusion

Is this still vibe coding? Or just good craftsmanship? After everything we have looked at: the word is compliment and insult at the same time, just never in the same project. As a compliment it stands for Karpathy's liberating experiment, for things that are allowed to break. And maybe also for that glorious feeling when you and your assistant are properly in the flow and the new feature rocks. It becomes an insult the moment other people use your software and nobody has read what the model drew from its probabilities — in other words, what got diced. 🎲 <!-- dash allowed here --> The line between the two is Willison's dividing line: read, test, be able to explain. Then it is software development, no matter who types.

The finest punchline comes from the inventor himself: When Karpathy released his project nanochat in October 2025, someone asked how much of it the AI had written. [His answer](https://x.com/karpathy/status/1977758204139331904): "it's basically entirely hand-written (with tab autocomplete). I tried to use claude/codex agents a few times but they just didn't work well enough at all and net unhelpful, possibly the repo is too far off the data distribution." The father of vibe coding wrote his most important project by hand. 😄 And his reasoning makes for perhaps the best rule of thumb to close on: the further your problem sits from the bulk of the training material, the less the vibe carries, and the more the craft counts.

And in case you are wondering where to learn all this: vibes need no course. Craftsmanship does. 😉 That is exactly what [agentic.schule](https://agentic.schule) is for.

**Questions, feedback, vibe stories of your own?** Bring them on, I am glad to hear from you.

---

*Curious about agentic work in practice? In the workshops at [agentic.schule](https://agentic.schule) and [angular.schule](https://angular.schule) we show how modern AI agents are changing everyday development.*
