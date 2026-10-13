interface Env { RESEND_API_KEY?: string; RESEND_FROM_EMAIL?: string }
const interests = ['Sell a property','Investment opportunity','General inquiry'];
const json=(data:object,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function inquiry(request:Request,env:Env):Promise<Response>{
 if(request.method!=='POST')return json({error:'Method not allowed'},405);
 const origin=request.headers.get('origin'); if(origin && origin!==new URL(request.url).origin)return json({error:'Invalid origin'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'Expected JSON'},415);
 if(Number(request.headers.get('content-length')||0)>16000)return json({error:'Inquiry too long'},413);
 let body:Record<string,unknown>;try{const raw=await request.text();if(raw.length>16000)return json({error:'Inquiry too long'},413);body=JSON.parse(raw);if(!body||typeof body!=='object')throw Error();}catch{return json({error:'Invalid inquiry'},400)}
 if(body.website)return json({ok:true});
 const {name,email,interest,message}=body;
 if(typeof name!=='string'||!name.trim()||name.length>150||typeof email!=='string'||email.length>254||!/^\S+@\S+\.\S+$/.test(email)||/[\r\n]/.test(email)||typeof interest!=='string'||!interests.includes(interest)||typeof message!=='string'||!message.trim()||message.length>5000)return json({error:'Please check your details and try again.'},400);
 if(!env.RESEND_API_KEY||!env.RESEND_FROM_EMAIL)return json({error:'We couldn’t send your inquiry right now. Please email sterlingoakholdings2026@gmail.com directly.'},503);
 try{const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:env.RESEND_FROM_EMAIL,to:['sterlingoakholdings2026@gmail.com'],reply_to:email,subject:`Website inquiry: ${interest}`,text:`Name: ${name.trim()}\nEmail: ${email}\nInterest: ${interest}\n\n${message.trim()}`}),signal:AbortSignal.timeout(15000)});if(!response.ok)return json({error:'We couldn’t send your inquiry. Please try again or email us directly.'},502);const result=await response.json() as {id?:string};if(!result.id)return json({error:'Delivery was not confirmed. Please email us directly.'},502);return json({ok:true});}catch{return json({error:'Connection interrupted. Please try again or email us directly.'},502)}
}
