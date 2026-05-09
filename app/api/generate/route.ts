import Groq from 'groq-sdk';
import { NextRequest } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { brief, niche, tone } = await req.json();

    const result = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are a top-rated Fiverr freelancer who writes short, sharp proposals that get replies.
Your proposals feel like a real person wrote them in 2 minutes — not an AI, not a template.
You never use fancy words. You write the way a confident friend would text a client.
Short sentences. Real words. No fluff.`
        },
        {
          role: 'user',
          content: `Write a Fiverr proposal for a ${niche} freelancer.
Tone: ${tone}
Client posted: "${brief}"

Rules:
- Max 80 words. Short is powerful.
- Open with something that shows you READ their brief — one specific detail
- One sentence on exactly what you will do for them
- One sentence on why it will work or what makes your approach different
- End with a short easy question they actually want to answer
- Write like a human texting — casual, warm, confident
- Zero buzzwords. Zero AI phrases like "I would love to", "I am passionate", "look no further"
- No bullet points. Just short punchy paragraphs.
- Never start with I, Hi, Hello or your name

Only write the proposal. Nothing else.`
        }
      ]
    });

    const proposal = result.choices[0]?.message?.content || '';
    return Response.json({ proposal });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ proposal: '', error: message }, { status: 500 });
  }
}