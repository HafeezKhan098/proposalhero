import { NextResponse } from 'next/server';
import { consume, rollback } from '@/lib/usage';
import { assertUsefulInput, structured } from '@/lib/groq';

const schema={type:'object',properties:{subject_line:{type:'string'},proposal:{type:'string'},note:{type:'string'}},required:['subject_line','proposal','note'],additionalProperties:false};

export async function POST(req:Request){
  let usage:any;
  try{
    const body=await req.json();
    const brief=assertUsefulInput(String(body.brief||''),20);
    const platform=String(body.platform||'Upwork');
    const category=String(body.category||'Other');
    const tone=String(body.tone||'Professional');
    const skills=String(body.skills||'').trim();
    const experience=String(body.experience||'').trim();
    const portfolio=String(body.portfolio||'').trim();
    const mention=String(body.mention||'').trim();
    usage=await consume('proposal');
    if(!usage?.allowed)return NextResponse.json({error:`You've reached your ${usage.guest?'guest':'free'} proposal limit. Create a free account or upgrade to Pro to continue.`,usage},{status:429});

    const data=await structured('freelance_proposal',schema,[
      {role:'system',content:'You are ProposalHero, an expert freelance proposal writer. Write a proposal that is ready to send after a quick personal edit. Start from the client\'s actual brief. Sound like a capable human freelancer, not an AI template. Keep it concise: normally 150-250 words. Do not use headings such as Opening, Understanding, Approach, Deliverables, Timeline, Investment, Proof or Next Step inside the proposal. Use short natural paragraphs and, only when genuinely useful, a short bullet list. Do not invent client facts, credentials, years of experience, results, prices, dates, availability or portfolio claims. Only use freelancer skills, experience, portfolio and special notes supplied by the user. If those are missing, simply write without unsupported claims. Do not add a fake signature. End with a useful, low-pressure question or next step. The separate note must tell the freelancer to edit a few words and add their own voice before sending.'},
      {role:'user',content:`Write a ready-to-send ${platform} freelance proposal for a ${category} project in a ${tone} tone.\n\nCLIENT BRIEF:\n${brief}\n\nFREELANCER SKILLS:\n${skills||'Not provided'}\n\nRELEVANT EXPERIENCE:\n${experience||'Not provided'}\n\nPORTFOLIO:\n${portfolio||'Not provided'}\n\nSPECIFIC NOTE TO INCLUDE:\n${mention||'None'}\n\nReturn only the requested JSON fields.`}
    ],1800);
    return NextResponse.json({data,usage});
  }catch(e){
    if(usage?.allowed)await rollback('proposal').catch(()=>{});
    return NextResponse.json({error:e instanceof Error?e.message:'Unable to generate proposal right now.'},{status:400});
  }
}
