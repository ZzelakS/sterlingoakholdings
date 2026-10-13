import {test} from 'node:test';
import assert from 'node:assert/strict';
import {inquiry} from '../server/inquiry.ts';
const details={name:'Test visitor',email:'visitor@example.com',interest:'Sell a property',message:'A residential property inquiry.'};
const req=(body=details,extra={})=>new Request('https://example.com/api/inquiry',{method:'POST',headers:{'content-type':'application/json',origin:'https://example.com',...extra},body:JSON.stringify(body)});
test('rejects malformed inputs and cross-origin submissions',async()=>{assert.equal((await inquiry(req({...details,email:'bad'}),{})).status,400);assert.equal((await inquiry(req(details,{origin:'https://elsewhere.com'}),{})).status,403)});
test('missing configuration produces an honest error',async()=>{const r=await inquiry(req(),{});assert.equal(r.status,503);assert.match((await r.json()).error,/email/)});
test('recipient and reply address are correctly routed; provider errors never show success',async()=>{const original=globalThis.fetch;try{let sent;globalThis.fetch=async(url,init)=>{assert.equal(url,'https://api.resend.com/emails');sent=JSON.parse(init.body);return Response.json({id:'mock-email-id'})};const env={RESEND_API_KEY:'test-only-key',RESEND_FROM_EMAIL:'Website <enquiries@example.com>'};assert.equal((await inquiry(req(),env)).status,200);assert.deepEqual(sent.to,['sterlingoakholdings2026@gmail.com']);assert.equal(sent.reply_to,details.email);globalThis.fetch=async()=>Response.json({error:'mock failure'},{status:403});assert.equal((await inquiry(req(),env)).status,502)}finally{globalThis.fetch=original}});
