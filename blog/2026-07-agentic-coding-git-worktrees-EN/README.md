---
title: 'One Trunk, Many Branches: git worktrees for Parallel AI Agents'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe is a trainer and consultant for modern web development. The workshops at <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> and <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> focus on Angular in practice – and increasingly on agentic development with AI agents like Claude Code.'
bioHeading: About the author
published: 2026-07-26
keywords:
  - git worktree
  - Agentic Coding
  - AI Agent
  - Claude Code
  - Parallelization
  - Multi-Repo
  - Monorepo
  - GitHub Copilot
  - Cursor
  - Antigravity
  - Kendo UI
language: en
header: header.jpg
---

In classical software development, isolation came for free: one developer, one personal computer, one checkout. Every coding agent today assumes just as naturally that the working directory belongs to it alone: it reads files, changes them, runs builds and tests, and its subagents do the same in parallel. Okay, I can't really say whether every agent behaves this way. But my Claude Code, at least, is a little Rambo without etiquette. Now, though, many of these agentic developers romp around on the same computer at the same time, and as soon as two of them claim the same directory for themselves, you quickly end up in a tangled mess: two agents editing the same files, tests checking states that never existed, and in the end nobody knows which diff came from whom.

**The solution is an unassuming git built-in that is now in use all across the agentic tools: git worktrees. Every agent gets its own working directory on its own branch, the sole-ownership assumption holds again, and suddenly any number of sessions run in parallel without getting in each other's way.**

This article shows the technique behind it, the built-in worktree support of today's agentic tools, and the init command I use to span a feature branch with worktrees across two repos.

## Contents

[[toc]]

## The Problem: One Agent Occupies the Whole Repo

Let's imagine the following morning: Claude Code is working on a bigger refactoring and keeps running the tests along the way. A run like this takes a while. Right in the middle of it, a bug report arrives. Production. Should ship today.

With a classic single checkout, we now have three bad options:

- **Wait.** The bugfix waits for an agent that has nothing to do with it.
- **Abort the agent.** Half the work is done, the context built up, all for the bin.
- **`git stash` and switch branches while the agent is running.** Please don't. The agent reads and writes in exactly this directory. If we switch the branch underneath it, it edits foreign file states from that moment on, and the tests check a state that never existed.

Even without an emergency, the classic context switch is a pain: stash, checkout, `npm install` because the other branch has different dependencies, the IDE re-indexes. Working like this is anything but comfortable.

On top of that comes a luxury problem: frontier models with plenty of reasoning are thorough, but leisurely. Commands like `/code-review` sometimes run absurdly long for me. The natural reaction: parallelize. While session one runs the review, session two should start on the next feature. Except: with two agents in the same working directory, the hoped-for parallelism turns into a race for the same files. On top of that, some features are mutually exclusive and others may only land in a specific order. Two half-finished features in the same directory produce a mixed state that will never exist in the finished product. And that, of all things, is what builds and tests then run against.

The naive way out would be to simply clone the repo several times. That works, but it's wasteful (every copy drags its own `.git` along, and you fetch multiple times, too) and above all unnecessary: git has had a built-in for exactly this case for years.

## What Are git worktrees?

A [git worktree](https://git-scm.com/docs/git-worktree) is an additional working directory of the same repository. The git docs call the checkout you get when cloning the *main worktree*. Everything you add with `git worktree add` is a *linked worktree*. All of them share the same `.git`, that is, the complete history, all branches, all remotes, and the object database. What's independent in each worktree is exactly what makes up the working state: the checked-out files, its own `HEAD`, and its own index.

This has three pleasant consequences. First, a worktree is created in seconds and disposed of just as quickly; after all, it's only a fresh checkout and no second repository. Second, the worktrees see each other: a commit on branch A is instantly visible in the log on branch B, and a single `git fetch` supplies them all. And third, for me the most important point against multiple cloned repos: you get **guaranteed exclusivity on every local branch name.** In two independent clones, you can accidentally create the same branch twice.

> **🛠️ Build it yourself: the four commands you need**
> ```bash
> # Create a new working directory as a sibling folder, with a new branch
> git worktree add ../app-frontend-checkout -b feature/checkout
>
> # Or check out an existing branch
> git worktree add ../app-frontend-hotfix hotfix/prices
>
> git worktree list      # what lives where, on which branch?
> git worktree remove ../app-frontend-checkout
> git worktree prune
> ```
> The last two are easy to mix up: `remove` is the clean teardown, it disposes of the directory along with git's internal bookkeeping. With uncommitted changes it refuses to act (only `--force` overrules that), and committed work is never lost in the process, the branch lives on in the shared repo. `prune` only repairs: if you delete a worktree folder with a plain `rm -rf`, orphaned bookkeeping entries remain in the repository, and `prune` clears those away.

One rule you have to know: **A branch can only ever be checked out in one worktree.** If you try to open the same branch in two worktrees, git refuses the command (whoever forces it with `--force` hopefully knows what they are doing). The rule has a good reason: two checkouts of the same branch would shred each other's commits and index. For our agent scenario, the rule is actually a feature, because it enforces exactly the model we want: one worktree, one branch, one agent.

Two more things worth knowing:

- **Things you don't immediately see are shared, too.** Hooks (`.git/hooks`) and the local repo configuration apply to all worktrees together. A pre-commit hook is in effect everywhere.
- **Everything that's gitignored is NOT shared.** `node_modules`, `.env`, build caches: a fresh worktree is a fresh checkout, all of that is missing there at first. That's a curse (installation per worktree, more on that later) and a blessing at the same time (no half-built artifacts from the wrong branch).

Worktrees existed long before the AI agents. Classically, you use them for the hotfix next to the running feature, or to check out a pull request without touching your own state. With agents, a new permanent situation joins the list: the personal computer suddenly hosts a whole team, and every team member needs its own checkout.

## What the Tools Make of It

Anthropic, Microsoft, Google, OpenAI, Cursor, and Cognition noticed this long ago. **Locally, isolation means git worktree; in the cloud, it means a dedicated VM or container.**

| Tool | Parallel work | Isolation |
|---|---|---|
| [Claude Code](https://code.claude.com/docs/en/worktrees) | parallel sessions via `--worktree`, isolated subagents | git worktrees under `.claude/worktrees/`, desktop app: automatic per session |
| [Cursor](https://cursor.com/docs/configuration/worktrees) | up to eight agents on a single prompt | automatically managed git worktrees or remote machines |
| [GitHub Copilot](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) | parallel cloud sessions, one draft PR each | ephemeral GitHub Actions environment per session |
| [VS Code](https://code.visualstudio.com/docs/copilot/agents/background-agents) | background agents (Copilot CLI, Claude, Codex) | automatically one git worktree per session |
| [Windsurf](https://docs.windsurf.com/windsurf/cascade/worktrees) | worktree mode per chat, merge button back | git worktrees under `~/.windsurf/worktrees/` |
| [Google Antigravity](https://antigravity.google/docs/projects) | Agent Manager for many parallel agents | "New Worktree Mode" per conversation, optionally per subagent |
| [OpenAI Codex](https://developers.openai.com/codex/app/worktrees) | multiple chats per project, parallel cloud tasks | git worktrees "under the hood", cloud: container per task |
| [Devin](https://docs.devin.ai/onboard-devin/environment) | many sessions, "MultiDevin" orchestration | dedicated VM per session, booted from a snapshot |
| [Google Jules](https://jules.google/docs/environment/) | parallel tasks, limit depends on plan | fresh VM per task |
| [Aider](https://aider.chat/docs/faq.html) | officially no parallel story | community practice: one worktree per instance, by hand |

(As of July 2026. The feature landscape in this field seems to change weekly; each link leads to the official docs.)

The local tools bet on worktrees, the cloud services on throwaway VMs, where a dedicated VM is the most obvious route anyway. What they all share is the isolation: **no tool lets two agents work unsupervised in the same directory.** The following sections show what this looks like in practice, starting with my tool of choice.

### The Claude Code Way

[Claude Code](https://claude.com/claude-code) now has worktrees firmly built in and has given them a [dedicated docs page](https://code.claude.com/docs/en/worktrees). The most important entry point is a CLI flag:

```bash
claude --worktree feature-auth     # short: claude -w feature-auth
```

This creates a worktree `.claude/worktrees/feature-auth/` below the repo, on a new branch `worktree-feature-auth`, and starts Claude right inside it. Do the same in a second terminal with a different name, and you have [two cleanly isolated sessions](https://code.claude.com/docs/en/common-workflows#run-parallel-sessions-with-worktrees). If you omit the name, Claude rolls one itself, something like `bright-running-fox`. On exit, Claude cleans up: an unchanged worktree of an unnamed session is removed automatically; otherwise it asks whether directory and branch should stay.

It works just as well mid-session: ask Claude to "please work in a worktree for this", and it creates one itself and switches into it (behind the scenes, a tool called `EnterWorktree` takes care of that).

It gets really elegant with [subagents](https://code.claude.com/docs/en/sub-agents), the helper agents Claude delegates subtasks to:

> **🛠️ Build it yourself: isolate subagents automatically**
> A file `.claude/agents/refactorer.md` with `isolation: worktree` in the frontmatter is all it takes, and every run of this subagent gets its own temporary worktree:
> ```markdown
> ---
> name: refactorer
> description: Applies mechanical refactorings across many files
> isolation: worktree
> ---
>
> Apply the requested refactoring across all affected files,
> then run the tests and report the result.
> ```
> If the subagent finishes without changes, Claude Code removes the worktree automatically. With changes, it stays around until a periodic sweep can clear it away without losing work.

A detail from practice: because a fresh worktree starts without the gitignored files, `.env` for example, there is `.worktreeinclude`, a file in the project root in `.gitignore` syntax. Whatever is listed there and is itself gitignored gets copied automatically into every new worktree when Claude Code creates it (tracked files are deliberately never duplicated).

In the desktop app, the principle is already the default, by the way: there, every new parallel session automatically gets its own worktree. And in case you go looking for it first, like I did: there is no `/worktree` slash command, the flag at startup and the mid-session request cover everything.

### The Antigravity Way

Google builds the isolation right into the IDE. [Antigravity](https://antigravity.google/docs/projects) manages agents through its own Agent Manager: an overview where several agents run in parallel and can be observed. When starting a conversation, you can pick the "New Worktree Mode"; Antigravity then provisions a fresh git worktree in the background and the conversation works there, leaving the active working directory untouched. Subagents know the same choice: they inherit their parent's workspace or get their own isolated worktree. One detail stands out: an Antigravity "project" may span several folders, and the worktree mode creates worktrees for all git checkouts of the project. More on that in a moment.

### The Copilot Way

Microsoft runs on two tracks. In [VS Code](https://code.visualstudio.com/docs/copilot/agents/background-agents), background agents (the Copilot CLI, optionally also Claude or Codex) each get an automatically created git worktree per session. The changes stay isolated there until you review them and merge them into your workspace, or send them off as a pull request right away. The second track leaves your machine entirely: the [Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) picks up tasks from a GitHub issue or from chat, works in an ephemeral GitHub Actions environment, and reports back with a draft pull request. Several of these sessions run in parallel, and once the work is done, the environment is disposed of.

### The Codex Way

OpenAI spans the same arc. In the ChatGPT desktop app, [Codex](https://developers.openai.com/codex/app/worktrees) can run several independent chats in the same project, with git worktrees under the hood: each chat gets a lightweight, Codex-managed worktree by default. Whoever wants to keep working on one state for longer creates a permanent worktree instead. The feature requires a git repository. In the cloud it works like everywhere else: every task gets its own isolated container, several of them in parallel.

## And When a Feature Touches Two Repos?

So much for the intact world of single-repo demos. Reality in grown system landscapes looks different: a system spreads across several repositories. Frontend here, backend there, plus a few services. The monorepo approach solves this on paper, but it's far from always feasible: separate teams and permissions, different build and deploy worlds, grown history. You work with the system landscape you happen to have.

Let's take a simplified example: an Angular frontend in the repo `app-frontend`, a .NET API in the repo `app-backend`. The "checkout" feature needs new endpoints **and** new components. The branch should have the same name in both repos, in our case named after the ticket, say `shop-4711-checkout`. That way review, CI, and everyone involved find the matching states at a glance.

And now the prize question: what does `claude --worktree` make of this? Exactly, **one** worktree, in the current repo. Almost all built-in worktree features think in terms of one repository. The honorable exception is Antigravity, whose "New Worktree Mode" creates worktrees for all git checkouts of a project, but without a freely chosen shared branch name and without everything that comes after the checkout: dependencies, licenses, project rules.

For my workflow, that means: build it yourself. Luckily, in Claude Code that's surprisingly little work.

## My Init Command: One Command, Two Repos, Two Worktrees

Custom [slash commands](https://code.claude.com/docs/en/skills) in Claude Code are simply Markdown files: a file `~/.claude/commands/feature-init.md` creates the command `/feature-init`. The content is a work instruction for the agent: prose with a few commands in it. Such a command creates my worktree pairs. The procedure it enforces:

1. **Ask for the feature name.** It becomes the branch name, identical in both repos.
2. **Update both repos and check whether the branch already exists**, locally or on the remote. The decision is made per repo: if the branch already exists there, it gets checked out (maybe someone already started yesterday, or it was me and the feature has once again been sitting around for too long). If not, it's created fresh from the latest `origin/main`.
3. **One worktree per repo**, as a sibling folder with a speaking name: `app-frontend-shop-4711-checkout/` next to `app-frontend/`.
4. **Install dependencies and activate the Kendo license**, per worktree: `npm install` in the frontend, `dotnet restore` in the backend (more on the license in a moment).
5. **Read the project rules:** the `CLAUDE.md` of both worktrees.
6. **The iron rule:** work happens exclusively in the worktrees. The main directories remain untouched.

**🛠️ Build it yourself: the complete command file `~/.claude/commands/feature-init.md`.** It is deliberately prose instead of a shell script, and deliberately loud. Why, the remarks afterwards explain; if you already got the flow from above, jump straight there.

````markdown
# Create feature worktrees for frontend and backend

## Ask for the feature name

Ask the user for the name of the new feature (e.g. `shop-4711-checkout`).
This name is used as the branch name for BOTH repos.

## Create the worktrees

First fetch the latest state in both repos:

```bash
git -C ~/Work/shop/app-backend fetch origin
git -C ~/Work/shop/app-frontend fetch origin
```

Then check in BOTH repos whether the branch already exists (locally or remote):

```bash
git -C ~/Work/shop/app-backend  branch --list <feature-name>
git -C ~/Work/shop/app-backend  branch --list -r "origin/<feature-name>"
git -C ~/Work/shop/app-frontend branch --list <feature-name>
git -C ~/Work/shop/app-frontend branch --list -r "origin/<feature-name>"
```

Decide PER repo (the cases can differ, for example when work so far
has only happened in one of the two repos):

**Branch does NOT exist in this repo:** create a new branch from the latest `origin/main`:

```bash
git -C ~/Work/shop/app-backend worktree add \
  ~/Work/shop/app-backend-<feature-name> -b <feature-name> origin/main
git -C ~/Work/shop/app-frontend worktree add \
  ~/Work/shop/app-frontend-<feature-name> -b <feature-name> origin/main
```

**Branch already exists in this repo** (locally or remote): check out the existing branch:

```bash
git -C ~/Work/shop/app-backend worktree add \
  ~/Work/shop/app-backend-<feature-name> <feature-name>
git -C ~/Work/shop/app-frontend worktree add \
  ~/Work/shop/app-frontend-<feature-name> <feature-name>
```

## Install dependencies

Right after creating the worktrees:

- **Backend:** run `dotnet restore` in the backend worktree.
- **Frontend:** run `npm install` in the frontend worktree.
- **Frontend, Kendo license:** after `npm install`, run `npm run kendo-license-activate`
  once in the frontend worktree. The activation patches files under
  `node_modules/@progress/kendo-licensing/` and is therefore required PER worktree.
  Without activation, the components render with a watermark and a license warning.

## MANDATORY: read the project rules

Before any work, the following files MUST be read and taken into account:

- `~/Work/shop/app-backend-<feature-name>/CLAUDE.md`
- `~/Work/shop/app-frontend-<feature-name>/CLAUDE.md`

## ABSOLUTE RULE: Always work in the worktrees!

NEVER edit files in the main directories. All file operations
(Read, Edit, Write, Bash) MUST point to the worktree paths:

- `~/Work/shop/app-backend-<feature-name>/`
- `~/Work/shop/app-frontend-<feature-name>/`

The main repos (`app-backend/` and `app-frontend/`) must NOT be modified.
````

A few remarks:

- **Why prose instead of a shell script?** Because an agent can react to surprises: a half-existing branch, an already occupied folder name, a failed installation. A bash script fails at the first deviation or steamrolls right over it. The agent reads the situation and decides in the spirit of the instruction.
- **Why the capital letters?** Shouting works. The last rule matters most: the main directories stay permanently clean on `main` and only serve as the base for `fetch` and `worktree add`. That way, two sessions can never accidentally share a working directory.
- **Why the `CLAUDE.md` from the worktree and not from the main repo?** The rules have to match the state the agent is actually working on: build commands, test commands, conventions. And if the branch is so old that `main` has different rules by now, the answer is a rebase, which brings the `CLAUDE.md` up to date as well.
- **The "one branch, one worktree" rule works for us here:** if a second session tries to initialize the same feature, git refuses to create the second worktree. Duplicate work on the same feature becomes visible immediately instead of colliding silently.
- **And does everyone stick to it?** Sadly, no. In my experience, subagents of all things sometimes ignore the rule entirely and happily work in the main directory. The main conversation would probably have to write the rule explicitly into every subagent's auto-generated prompt. At least the problem repairs itself for me: the main conversation always notices that the subagent went to work in the wrong directory and sends it off once more. It's still annoying, because it burns tokens for nothing.

## Ports, Licenses, Databases: The Pitfalls of Parallelism

The worktrees are in place, two agents are working on two branches. What remains are the collisions that don't happen in the file system, because even with separate directories, all agents still share one computer: its ports, its databases, its licenses.

### Dependencies Are Due per Worktree

`node_modules` in the frontend, `bin/` and `obj/` in the backend: all gitignored, so all new everywhere. That costs a few minutes and a good chunk of disk space. The reward: every worktree has exactly the dependencies of its branch and nothing leaks between features.

### Commercial Licenses That Patch node_modules

The pitfall that really caught us: [Kendo UI](https://www.telerik.com/kendo-angular-ui) stores its license activation as patched files under `node_modules/@progress/kendo-licensing/`. The activation lives in the installation artifact instead of the repo, and a fresh worktree starts from zero. To be fair: if Telerik finds the key on its own (as `telerik-license.txt` or an environment variable), a postinstall script takes care of it right during `npm install`. In our setup, a custom npm script wraps the key, so the drill is: activate again after every `npm install` in every worktree, or the components render with a watermark and a license warning. The lesson generalizes well: whatever a fresh `npm install` overwrites or forgets, the init command has to restore per worktree.

### Dedicated Ports for Every Branch

At the latest when two branches are supposed to be *up and running* at the same time, it gets crowded: both Angular dev servers want port 4200, both APIs the same port, both database containers anyway. My solution is unspectacular, a fixed port scheme per branch:

| Service | main repo | Branch 1 | Branch 2 |
|---|---|---|---|
| Angular dev server | 4200 | 4201 | 4202 |
| Backend API | 5001 | 5011 | 5021 |
| Database | 1433 | 1434 | 1435 |

Technically, this is wired up quickly: `ng serve --port 4201` for the frontend, the URL via environment variable (`ASPNETCORE_URLS`) for the backend, the port mapping in the compose file for the database container. The only thing that matters is consistency: the frontend of a branch must also point to the API of the **same** branch (proxy configuration or environment file), or you'll happily test against the wrong backend and wonder about ghost data.

### Parallel E2E Runs

The supreme discipline. Two test runs on a shared database sabotage each other: one clears away the test data the other is waiting for. If you want to test in parallel, you need separate database instances per branch, or at least cleanly separated data buckets within one instance. With the port scheme above, the separate instance is usually the easier path: spin up a second container, enter the port, done.

## Conclusion: Isolation Is the Ticket

**Parallelism starts with the working directory.** Isolation used to come automatically with the personal computer; with several agents on one machine, you have to create it yourself. git worktrees do that with built-in means in seconds.

Where the built-in features end, namely at the repo boundary, a self-built init command begins: one command, two repos, one branch name, two worktrees, dependencies and license included. The whole thing is one simple Markdown file. But it turns the most tedious part of everyday multi-repo work into a single question: "What's the feature called?"

I want to stay honest this time, too:

- **Parallelism is not an end in itself.** Three agents produce three times as many diffs, and somebody (me) has to read them all. On top of that, not all features get along: some are mutually exclusive, others have to land in a fixed order. Worktrees keep the states cleanly apart, but what gets merged when remains headwork. The bottleneck is the review.
- **The mental load stays.** Hopping from branch to branch is hard work in your head. That's why I rarely allow myself more than two or three branches at a time. The technology could easily handle more. My head hits its limit at review time well before that.
- **Discipline is part of it.** Install the deps, activate the license, assign the ports, clean up at the end. That's why all of it lives in the init command instead of my memory.

**Questions, feedback, worktree tricks of your own?** Bring them on, I'm happy to hear from you. And if you like the init command: rebuild it. It is deliberately kept so generic that it fits any two-repo setup.

---

*Curious about agentic work in practice? In the workshops at [agentic.schule](https://agentic.schule) and [angular.schule](https://angular.schule) we show how modern AI agents are changing everyday development.*
