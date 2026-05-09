import Groq from 'groq-sdk';
import { NextRequest } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { brief, niche, tone, mode } = await req.json();

    const isHumanize = mode === 'humanize';

    const systemPrompt = isHumanize
      ? `You are a human freelancer editing an AI proposal to sound completely natural.
You remove all robotic patterns, vary sentence lengths, add slight informality.
You write like a real person texting a client — warm, confident, imperfect in a natural way.
Never use: "I am passionate", "look no further", "I would love to", "as per your requirements".
Use contractions like "I'll", "you'll", "it's", "don't".
Mix short punchy sentences with longer ones.
Sound like a real experienced freelancer, not a robot.`
      : `You are a top-rated Fiverr freelancer who writes short sharp proposals that get replies.
You write like a confident friend — casual, warm, real.
Zero buzzwords. Zero AI phrases.
Short sentences. Real words. No fluff.`;

    const userPrompt = isHumanize
      ? `Take this proposal and rewrite it to sound completely human.
Remove all AI patterns. Make it warm, natural, conversational.
Keep the same meaning but make it sound like a real person wrote it.

Original proposal:
"${brief}"

Also give me:
HUMAN SCORE: [score out of 100]
AI RISK: [Low/Medium/High]
NATURALNESS: [score out of 100]

Format exactly like this:
PROPOSAL:
[rewritten proposal]

SCORES:
HUMAN SCORE: [X/100]
AI RISK: [Low/Medium/High]
NATURALNESS: [X/100]`
      : `Write a Fiverr proposal for a ${niche} freelancer.
Tone: ${tone}
Client posted: "${brief}"

Rules:
- Max 80 words
- Open with something showing you READ their brief
- One sentence on exactly what you will do
- One sentence on why your approach works
- End with a short easy question they want to answer
- Write like a human texting — casual, warm, confident
- Zero buzzwords
- No bullet points
- Never start with I, Hi, Hello or your name

Only write the proposal. Nothing else.`;

    const result = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    const content = result.choices[0]?.message?.content || '';

    if (isHumanize) {
      const proposalMatch = content.match(/PROPOSAL:\n([\s\S]*?)\n\nSCORES:/);
      const humanMatch = content.match(/HUMAN SCORE: (\d+)/);
      const aiRiskMatch = content.match(/AI RISK: (\w+)/);
      const naturalMatch = content.match(/NATURALNESS: (\d+)/);

      return Response.json({
        proposal: proposalMatch ? proposalMatch[1].trim() : content,
        humanScore: humanMatch ? parseInt(humanMatch[1]) : 85,
        aiRisk: aiRiskMatch ? aiRiskMatch[1] : 'Low',
        naturalness: naturalMatch ? parseInt(naturalMatch[1]) : 88,
        mode: 'humanize'
      });
    }

    return Response.json({ proposal: content, mode: 'generate' });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ proposal: '', error: message }, { status: 500 });
  }
}