// Generated content. Edit text here; keep the structure.
export type GuideSection = { heading: string; paragraphs?: string[]; bullets?: string[]; example?: string };
export type Guide = { slug: string; category: string; title: string; h1: string; description: string; minutes: number; updated: string; intro: string; sections: GuideSection[]; faqs: [string, string][]; related: string[] };

export const GUIDES_UPDATED = '2026-11-07';

export const guides: Guide[] = [
  {
    "slug": "how-to-write-an-upwork-proposal",
    "category": "Proposal writing",
    "title": "How to Write an Upwork Proposal: Structure, Example and Common Mistakes",
    "h1": "How to write an Upwork proposal that gets read",
    "description": "A practical structure for Upwork proposals: what to read in the job post, how to open, what proof to include, a worked example and the mistakes to avoid.",
    "minutes": 7,
    "intro": "Most Upwork proposals fail for a simple reason: they talk about the freelancer instead of the client. This guide gives you a repeatable structure, a worked example and a checklist you can use before you send anything. It will not guarantee a reply, because clients choose for many reasons, but it will make your proposals clearer and easier to say yes to.",
    "sections": [
      {
        "heading": "Start by reading the job post twice",
        "paragraphs": [
          "The first read is for the outcome the client wants. The second read is for the details: constraints, tools, deadlines, and any instruction such as a word they ask you to include in your reply. Clients often add a small instruction to see who actually read the post, so missing it is an easy way to lose the job.",
          "Write down three things before you type a word: the result the client wants, the biggest risk to that result, and one question you would need answered to do the job well."
        ]
      },
      {
        "heading": "A simple five-part structure",
        "paragraphs": [
          "You do not need a long cover letter. You need five short pieces, in this order."
        ],
        "bullets": [
          "An opening line about their situation, not about you. Mention a specific detail from the post.",
          "One piece of relevant proof: a similar project, a result you can verify, or a link to the closest portfolio item.",
          "Two or three sentences on how you would approach the work, in plain language.",
          "One clarifying question that shows you thought about the project.",
          "A low-pressure next step, such as offering a short call or asking which option they prefer."
        ]
      },
      {
        "heading": "Keep the first lines strong",
        "paragraphs": [
          "In a list of applicants, a client often sees only the first lines of each proposal before deciding whether to open it. Lead with substance. Greetings and long introductions use up the space that should show you understood the job."
        ]
      },
      {
        "heading": "A worked example",
        "paragraphs": [
          "Imagine a client wants their small studio website redesigned because visitors on phones struggle to find the booking page. Here is a short proposal that follows the structure."
        ],
        "example": "Hi Sam, your post says visitors on mobile struggle to find the booking page. That is usually a navigation and page-hierarchy problem rather than a visual one, and it is fixable without rebuilding the whole site.\n\nI recently redesigned a booking flow for a small fitness studio and reduced it from five taps to two. Here is the project: [link].\n\nI would start by mapping how a first-time visitor reaches the booking page today, then simplify that path and test it on a few real phones before touching the rest of the design.\n\nOne question: do bookings run through a third-party tool, or is the form built into the site?\n\nIf it helps, I can send a short outline of what I would change first. Happy to jump on a quick call if you prefer."
      },
      {
        "heading": "Mistakes that make proposals easy to ignore",
        "bullets": [
          "Copying the same message to every job. Clients can tell when a proposal could have been sent to anyone.",
          "Listing every skill you have instead of the two or three that matter for this job.",
          "Claiming results you cannot back up. Only include what is true and checkable.",
          "Writing a wall of text. Short paragraphs and one bullet list at most are easier to scan.",
          "Ending without a next step, so the client has nothing easy to reply to.",
          "Ignoring a specific instruction in the job post."
        ]
      },
      {
        "heading": "Using AI without sounding like AI",
        "paragraphs": [
          "AI can give you a clean first draft quickly, but a draft that is not grounded in the real job post will read as generic. Paste the actual brief, add your real experience, then edit the result so it sounds like you. Our guide on making AI-written proposals sound human walks through that editing step."
        ]
      },
      {
        "heading": "Checklist before you send",
        "bullets": [
          "Does the first line mention something specific from this job?",
          "Is every claim about you true and easy to verify?",
          "Is there exactly one clear question or next step?",
          "Could this message be sent to a different client unchanged? If yes, rewrite the opening.",
          "Did you follow every instruction in the job post?"
        ]
      },
      {
        "heading": "A two-minute research routine before you write",
        "paragraphs": [
          "Personalizing does not need an hour of research. Spend two minutes on the following, then write."
        ],
        "bullets": [
          "Read the client profile if it is visible: what they have hired for before and how they describe themselves.",
          "Check whether the job post links to a website or example, and look at it for one concrete observation.",
          "Note the client wording for the problem, and reuse a few of their words in your opening.",
          "Decide the single most relevant piece of work you can show."
        ]
      },
      {
        "heading": "Follow up without being pushy",
        "paragraphs": [
          "If a client has viewed your proposal but not replied, a short, useful follow-up is fine after a few days: one sentence, one new helpful detail, and no pressure. Never send repeated messages that only ask whether they have decided yet."
        ]
      }
    ],
    "faqs": [
      [
        "How long should an Upwork proposal be?",
        "There is no official length. As a rule of thumb, short proposals of roughly 100 to 200 words are easier to read, as long as they respond to the specific job."
      ],
      [
        "Should I include my rate in the proposal?",
        "Follow the instructions in the job post. If the client does not ask, many freelancers focus on understanding the project first and discuss scope and price once they know more."
      ],
      [
        "Is it okay to use AI to write a proposal?",
        "Yes, as a starting point, as long as you review it, remove anything untrue and add details only you know. The proposal should still reflect your real experience."
      ],
      [
        "Do I need a portfolio link?",
        "It helps when it is relevant. Link the one or two pieces closest to the job rather than a general homepage."
      ]
    ],
    "related": [
      "make-ai-proposals-sound-human",
      "freelance-proposal-template"
    ],
    "updated": "2026-11-07"
  },
  {
    "slug": "how-to-write-a-fiverr-proposal",
    "category": "Proposal writing",
    "title": "How to Write a Fiverr Proposal or Offer That Buyers Understand",
    "h1": "How to write a Fiverr proposal or offer buyers can say yes to",
    "description": "How to respond to a Fiverr buyer message or brief: confirm scope, explain what is included, set a clear timeline and make the next step easy.",
    "minutes": 6,
    "intro": "When a buyer reaches out on Fiverr, they usually want three answers quickly: do you understand what I need, what exactly will I get, and when. A good reply gives those answers in a few short paragraphs. Fiverr changes its tools and rules from time to time, so check the current guidelines inside your seller account. The writing principles below apply whichever format you use.",
    "sections": [
      {
        "heading": "Reply to the message, not to your gig page",
        "paragraphs": [
          "Your gig page already describes what you sell in general. A buyer who messages you wants to know that you read their specific request. Start by restating their goal in one sentence, using their words where you can."
        ]
      },
      {
        "heading": "Confirm the scope before you commit",
        "paragraphs": [
          "Misunderstandings about scope are the most common source of disputes. Before you offer a price or timeline, confirm the details that change the work."
        ],
        "bullets": [
          "What is the main deliverable, and in what format?",
          "How many revisions are included?",
          "What materials will the buyer provide, and by when?",
          "Is there a fixed deadline the buyer must hit?",
          "Is anything explicitly out of scope?"
        ]
      },
      {
        "heading": "Explain what is included in plain language",
        "paragraphs": [
          "Buyers compare options quickly. Say what they will receive, how many versions or revisions are included, and how long it will take. Avoid jargon unless the buyer used it first."
        ]
      },
      {
        "heading": "A short example reply",
        "example": "Hi Priya, thanks for reaching out. You need a logo and a simple colour palette for a new bakery, and you would like to see the first concepts within a week.\n\nI would deliver three initial concepts, then refine the one you choose with up to two rounds of changes. You will receive the final files in the formats you need for print and social media.\n\nTwo quick questions so I get it right: do you have any colours or logos you already like, and is there a name or tagline that must appear in the design?\n\nIf that sounds right, I can start as soon as you confirm."
      },
      {
        "heading": "Mistakes to avoid",
        "bullets": [
          "Sending the same copy-and-paste reply to every buyer.",
          "Promising more than the order you are quoting includes.",
          "Leaving the timeline vague.",
          "Moving the conversation or payment off the platform in a way the platform rules do not allow. Always check the current rules.",
          "Replying slowly. A prompt, clear answer builds trust."
        ]
      },
      {
        "heading": "Where AI helps",
        "paragraphs": [
          "Use AI to draft the first version of your reply from the buyer message, then edit it so the scope, price and timeline are exactly what you intend to deliver. Never send a number or promise you have not checked yourself."
        ]
      },
      {
        "heading": "A reusable reply structure",
        "bullets": [
          "One sentence restating the buyer goal in their words.",
          "What you will deliver, how many revisions are included and when.",
          "One or two questions that remove the biggest uncertainty.",
          "A clear next step, such as confirming the details so you can start."
        ]
      },
      {
        "heading": "Pricing, extras and revisions",
        "paragraphs": [
          "Decide before you reply what is included in the base price, what counts as an extra, and how many revision rounds you allow. Put those answers in your message in plain words. Buyers rarely mind clear limits, but they do mind surprises after the order starts."
        ]
      },
      {
        "heading": "Follow up politely",
        "paragraphs": [
          "If a buyer goes quiet, one friendly follow-up after a day or two is reasonable. Keep it short, repeat the next step and avoid pressure."
        ]
      }
    ],
    "faqs": [
      [
        "Can I use ProposalHero for Fiverr?",
        "Yes. Choose Fiverr as the platform when you generate a proposal. Always review the draft and adapt it to the platform’s current rules and the buyer message."
      ],
      [
        "How do I handle a buyer who is vague?",
        "Ask two or three focused questions about the deliverable, the deadline and the materials. Clear scope protects both of you."
      ],
      [
        "Should I offer a discount to win the order?",
        "That is your business decision. Many freelancers prefer to explain the value and scope clearly rather than lower the price straight away."
      ]
    ],
    "related": [
      "how-to-write-an-upwork-proposal",
      "freelance-proposal-template"
    ],
    "updated": "2026-11-07"
  },
  {
    "slug": "freelance-proposal-template",
    "category": "Templates",
    "title": "Freelance Proposal Template: A Simple Structure for Direct Clients",
    "h1": "A freelance proposal template you can adapt for direct clients",
    "description": "A clear, copy-and-adapt freelance proposal template with sections for understanding, scope, approach, timeline, pricing and next steps, plus tips for each part.",
    "minutes": 6,
    "intro": "When you pitch a direct client, a proposal is often a short document or email that explains what you will do, how long it will take and what it costs. The template below is a starting point you can adapt. It is not legal advice. If you need a binding contract, speak to a qualified professional.",
    "sections": [
      {
        "heading": "The template",
        "paragraphs": [
          "Replace everything in square brackets with real details. Delete any section that does not apply."
        ],
        "example": "Subject: Proposal for [project name]\n\nHi [Client name],\n\nThank you for sharing the details of [project]. Here is my understanding and how I would approach it.\n\n1. What I understood\n[Two or three sentences restating the client goal, the audience and any constraints.]\n\n2. Scope and deliverables\n- [Deliverable one]\n- [Deliverable two]\n- [Deliverable three]\nNot included: [anything out of scope]\n\n3. Approach\n[Three to five steps in plain language, such as research, first draft, review, revisions and final delivery.]\n\n4. Timeline\n[Start date or condition] to [delivery date], with a review point on [date].\n\n5. Investment\n[Fixed price or estimate], payable [terms]. [Number] rounds of revisions are included.\n\n6. Next step\nIf this looks right, reply to confirm and I will send [contract or invoice] and a start date. Happy to answer questions on a short call.\n\nBest,\n[Your name]\n[Portfolio link]"
      },
      {
        "heading": "Why each section matters",
        "bullets": [
          "Understanding: shows the client you read the brief and lets them correct any misunderstanding early.",
          "Scope and deliverables: the clearer this is, the fewer disagreements later.",
          "Not included: stating exclusions protects you from scope creep.",
          "Timeline: gives the client confidence and gives you a deadline to hold yourself to.",
          "Investment: state the price, what it covers and how revisions are handled.",
          "Next step: tell the client exactly what to do if they want to proceed."
        ]
      },
      {
        "heading": "Tips for a stronger proposal",
        "bullets": [
          "Match the length to the project. A small job needs a short proposal.",
          "Use the client’s own words for their goals.",
          "Offer one clear option rather than five. If you include tiers, keep them simple.",
          "Only include proof you can stand behind, such as a relevant project or a verifiable result.",
          "Proofread the numbers and dates twice."
        ]
      },
      {
        "heading": "Using ProposalHero with this template",
        "paragraphs": [
          "Paste the client brief into the Proposal Generator, choose Direct client, and use the output as a draft of the understanding and approach sections. Then fill in scope, timeline and price yourself, because those are commitments only you can make."
        ]
      },
      {
        "heading": "Adapting the template to your kind of work",
        "bullets": [
          "Design: list the number of concepts, revision rounds and the file formats you will deliver.",
          "Development: describe milestones, the environments you will use and what testing is included.",
          "Writing: state word counts, the research you will do and how many edits are included.",
          "Consulting: define the questions you will answer, the sessions and the final summary."
        ]
      },
      {
        "heading": "Sending the proposal",
        "paragraphs": [
          "For small projects, a clear email is often enough. For larger ones, a one or two page PDF looks more professional and is easier for a client to forward. Either way, keep the first paragraph short, because many people decide from the opening whether to keep reading."
        ]
      },
      {
        "heading": "After the client says yes",
        "bullets": [
          "Send a short written agreement or contract and ask for confirmation.",
          "Confirm the start date, the first milestone and how you will communicate.",
          "Request any assets or access you need up front, so the timeline is realistic."
        ]
      }
    ],
    "faqs": [
      [
        "Is a proposal the same as a contract?",
        "No. A proposal explains what you offer. A contract is a binding agreement. Many freelancers send a proposal first and a contract once the client agrees."
      ],
      [
        "Should I put my price in the proposal?",
        "Usually yes for direct clients, with a clear description of what the price covers and how revisions work."
      ],
      [
        "How long should a freelance proposal be?",
        "As short as it can be while still covering scope, timeline and price. One page is often enough for a small project."
      ]
    ],
    "related": [
      "how-to-write-an-upwork-proposal",
      "make-ai-proposals-sound-human"
    ],
    "updated": "2026-11-07"
  },
  {
    "slug": "make-ai-proposals-sound-human",
    "category": "AI workflow",
    "title": "How to Make AI-Written Proposals Sound Human (and Stay Truthful)",
    "h1": "How to make an AI-written proposal sound like you",
    "description": "Learn the signs of a generic AI proposal and a simple editing process to make it specific, honest and natural before you send it to a client.",
    "minutes": 6,
    "intro": "AI can save time on a first draft, but clients are good at spotting messages that could have been sent to anyone. The fix is not to avoid AI. It is to edit the draft until it contains real details, real proof and your own voice. This guide shows how.",
    "sections": [
      {
        "heading": "Signs a proposal sounds generic",
        "bullets": [
          "It opens with a greeting and a long statement about how excited the freelancer is.",
          "It could be sent to ten unrelated clients without changing a word.",
          "It lists skills and adjectives but no specific example.",
          "Every sentence is the same length and rhythm.",
          "It repeats the job post back without adding any insight.",
          "It ends with a vague line such as looking forward to hearing from you."
        ]
      },
      {
        "heading": "A five-step editing process",
        "paragraphs": [
          "Run every AI draft through these steps before it goes to a client."
        ],
        "bullets": [
          "Add one specific detail from the job post to the first line.",
          "Replace general claims with one real example, a number you can verify or a link to relevant work.",
          "Cut every sentence that would still be true for a different project.",
          "Vary the rhythm. Mix short sentences with longer ones, and read the message aloud.",
          "End with one clear question or next step."
        ]
      },
      {
        "heading": "Keep it truthful",
        "paragraphs": [
          "A natural-sounding proposal that contains an invented claim is worse than a plain one. Check every statement about your experience, results, prices and availability. Delete anything you would not be comfortable repeating on a call. ProposalHero is designed not to invent credentials, but you are the final reviewer."
        ]
      },
      {
        "heading": "Before and after",
        "paragraphs": [
          "A generic opening:"
        ],
        "example": "Hello, I am excited to apply for this opportunity. I am a highly skilled professional with extensive experience and I am confident I can deliver excellent results."
      },
      {
        "heading": "A specific version",
        "example": "Hi Dana, your post mentions that customers drop off at the checkout step. I worked on a similar checkout last year, and the biggest gain came from removing two form fields. Happy to show the before and after: [link]."
      },
      {
        "heading": "Where Humanize and Analyze fit",
        "paragraphs": [
          "After you generate a proposal, Humanize and improve reduces stiff phrasing, Analyze brief shows the client priorities and questions worth asking, and Score proposal highlights weak spots. Treat all three as editing aids. The final message should still be one you stand behind."
        ]
      },
      {
        "heading": "The read-aloud test",
        "paragraphs": [
          "Read the message aloud. If you would never say a sentence to a client on a call, rewrite it. Stiff phrases such as I am writing to express my interest or I would be thrilled to leverage my expertise tend to stand out the moment you hear them."
        ]
      },
      {
        "heading": "Build your own phrase bank",
        "paragraphs": [
          "Keep a short note of sentences you have written that clients responded well to, along with the way you naturally describe your process. Paste a few into your profile or your instructions so the draft starts closer to your voice."
        ]
      },
      {
        "heading": "What not to do",
        "bullets": [
          "Do not add invented numbers or testimonials to make a draft sound stronger.",
          "Do not hide that you do not have a skill. Offer an honest alternative instead.",
          "Do not send a draft you have not read from start to finish."
        ]
      }
    ],
    "faqs": [
      [
        "Do clients mind if I use AI?",
        "Policies and preferences vary by platform and client. Check the rules of the platform you use, and make sure the final message is accurate and reflects your own work."
      ],
      [
        "Can AI detectors tell if a proposal is AI-written?",
        "Detection tools are unreliable, and relying on them is the wrong goal. Focus on specificity and honesty, which clients value either way."
      ],
      [
        "How much should I edit an AI draft?",
        "Enough that every claim is true and the message clearly responds to this client. For most drafts that means rewriting the opening and adding one real example."
      ]
    ],
    "related": [
      "how-to-write-an-upwork-proposal",
      "how-to-write-better-ai-prompts"
    ],
    "updated": "2026-11-07"
  },
  {
    "slug": "how-to-write-better-ai-prompts",
    "category": "Prompting",
    "title": "How to Write Better AI Prompts: A Practical Structure With Examples",
    "h1": "How to write better AI prompts for real freelance work",
    "description": "A simple prompt structure with objective, context, constraints, format and quality bar, plus before-and-after examples for coding, design, SEO and writing.",
    "minutes": 7,
    "intro": "Most weak AI answers come from weak instructions. A good prompt does not need clever tricks. It needs a clear goal, enough context, sensible limits and a description of what a good answer looks like. This guide gives you a structure you can reuse for coding, design, marketing, research and client work.",
    "sections": [
      {
        "heading": "The five parts of a useful prompt",
        "bullets": [
          "Objective: what you want the AI to produce, in one sentence.",
          "Context: who it is for, the situation and any background the AI cannot guess.",
          "Constraints: length, tone, tools, things to avoid and anything that must be included.",
          "Output format: how you want the answer structured, such as a table, steps or code with comments.",
          "Quality bar: how you will judge the result, for example accurate, concise and ready to send."
        ]
      },
      {
        "heading": "Before and after",
        "paragraphs": [
          "A weak prompt:"
        ],
        "example": "Write a landing page for my coffee shop."
      },
      {
        "heading": "A stronger prompt",
        "example": "Write the copy for a one-page website for a small neighbourhood coffee shop that also sells pastries. The audience is local commuters and remote workers. Include a headline, a short intro, a menu highlights section, opening hours and a clear call to action to visit. Keep the tone warm and simple, under 300 words in total. Do not invent awards or reviews. Return each section under its own heading."
      },
      {
        "heading": "Adapting the structure by task",
        "bullets": [
          "Coding: state the language and framework, paste the relevant code and the error, and ask for an explanation along with the fix.",
          "Design: describe the audience, the screen or flow, brand direction and any accessibility needs.",
          "SEO: give the topic, the audience search intent and the format you need, and ask for a structure before the full draft.",
          "Research: ask for sources to verify and for uncertainty to be stated, then check the claims yourself.",
          "Client work: always say what must not be invented, such as prices, quotes or statistics."
        ]
      },
      {
        "heading": "Iterate instead of starting over",
        "paragraphs": [
          "Treat the first answer as a draft. Tell the AI what to keep, what to change and why. Short follow-ups such as make it shorter, use plainer language or add a second option often work better than rewriting the entire prompt."
        ]
      },
      {
        "heading": "Check the output",
        "paragraphs": [
          "AI can state wrong information confidently. For anything you will deliver to a client, verify facts, test code and read the result as a critical reviewer."
        ]
      },
      {
        "heading": "Let Prompt Generator do the structure",
        "paragraphs": [
          "If you do not want to write this structure every time, describe your task in plain words in the Prompt Generator, choose your AI tool and style, and copy the structured prompt it creates."
        ]
      },
      {
        "heading": "A reusable prompt template",
        "example": "Role and goal: You are helping me [task]. The result should be [outcome].\nContext: [audience, situation, background the AI cannot guess].\nConstraints: [length, tone, tools, things to avoid or never invent].\nOutput format: [headings, steps, table or code with comments].\nQuality bar: [how I will judge it, such as accurate, concise and ready to send]."
      },
      {
        "heading": "Give examples when style matters",
        "paragraphs": [
          "If you want a specific style, paste one short example of what good looks like and tell the AI what you like about it. Examples often communicate tone and structure better than a paragraph of adjectives."
        ]
      },
      {
        "heading": "Common prompt mistakes",
        "bullets": [
          "Asking for several unrelated things at once.",
          "Leaving out the audience or the purpose.",
          "Forgetting to say what must not be invented.",
          "Accepting the first answer without checking facts or testing code."
        ]
      }
    ],
    "faqs": [
      [
        "Do prompts work the same in every AI tool?",
        "The core structure works across most tools, but each has different strengths and limits. Adjust length and format to the tool you use."
      ],
      [
        "How long should a prompt be?",
        "As long as it needs to be to include the goal, context, constraints and format. More detail is helpful when it removes guesswork."
      ],
      [
        "What is the biggest prompt mistake?",
        "Leaving out context the AI cannot guess, such as the audience, the constraints or what good looks like."
      ]
    ],
    "related": [
      "make-ai-proposals-sound-human",
      "how-to-write-an-upwork-proposal"
    ],
    "updated": "2026-11-07"
  }
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
