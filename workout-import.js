(function(root){
'use strict';
const text=(v,label)=>{if(typeof v!=='string'||!v.trim()||v.length>200)throw Error('Invalid '+label);return v.trim();};
const number=(v,min,max,label)=>{if(!['number','string'].includes(typeof v)||String(v).trim()===''||!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max)throw Error('Invalid '+label);return Number(v);};
function csv(source){const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<source.length;i++){const c=source[i];if(c==='"'){if(quoted&&source[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&source[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';}else cell+=c;}if(quoted)throw Error('CSV has an unclosed quote.');row.push(cell);if(row.some(x=>x.trim()))rows.push(row);return rows;}
const key=w=>JSON.stringify([w.date,w.dayName,w.entries.map(e=>[e.name.toLowerCase(),e.sets.map(s=>[s.kg,s.reps,s.rir??null])])]);
function parse(source,filename,catalog=[]){
 if(source.length>5*1024*1024)throw Error('Choose a file smaller than 5 MB.');
 let workouts;
 if(/\.json$/i.test(filename)){let data;try{data=JSON.parse(source);}catch{throw Error('This JSON file is not valid.');}workouts=Array.isArray(data)?data:data.history;if(!Array.isArray(workouts))throw Error('JSON must be a FORGE backup or an array of workout records.');}
 else if(/\.csv$/i.test(filename)){
 const rows=csv(source.replace(/^\uFEFF/,''));const headers=(rows.shift()||[]).map(x=>x.trim().toLowerCase());const required=['date','workout','exercise','weight','unit','reps'];for(const h of required)if(!headers.includes(h))throw Error('CSV needs columns: '+required.join(', ')+'. Download the template below.');
 const groups=new Map(); rows.forEach((row,i)=>{if(row.length!==headers.length)throw Error('CSV row '+(i+2)+' has the wrong number of columns.');const r=Object.fromEntries(headers.map((h,j)=>[h,row[j].trim()]));if(!['kg','lb'].includes(r.unit.toLowerCase()))throw Error('CSV row '+(i+2)+': unit must be kg or lb.');const group=JSON.stringify([r.date,r.workout,r.session||'']);if(!groups.has(group))groups.set(group,{date:r.date,dayName:r.workout,entries:[]});const w=groups.get(group);let e=w.entries.find(x=>x.name===r.exercise);if(!e){e={name:r.exercise,sets:[]};w.entries.push(e);}e.sets.push({kg:number(r.weight,0,2205,'weight')/(r.unit.toLowerCase()==='lb'?2.2046226218:1),reps:r.reps,rir:r.rir||null});});workouts=[...groups.values()];
 }else throw Error('Choose a .csv or .json workout file.');
 if(!workouts.length||workouts.length>2000)throw Error('A file must contain 1–2,000 workouts.');
 let total=0;return workouts.map((w,i)=>{
 if(!w||typeof w!=='object'||!/^\d{4}-\d{2}-\d{2}(?:$|T| )/.test(w.date)||!Number.isFinite(Date.parse(w.date)))throw Error('Workout '+(i+1)+': use ISO dates such as 2026-09-21.');
 const datePart=w.date.slice(0,10);if(new Date(datePart+'T00:00:00Z').toISOString().slice(0,10)!==datePart)throw Error('Workout '+(i+1)+': date does not exist.');
 if(!Array.isArray(w.entries)||!w.entries.length||w.entries.length>100)throw Error('Workout '+(i+1)+' needs 1–100 exercises.');
 return {id:'import-'+crypto.randomUUID(),date:new Date(w.date).toISOString(),dayName:text(w.dayName,'workout name'),partial:!!w.partial,imported:true,entries:w.entries.map(e=>{const name=text(e.name,'exercise name');const match=catalog.find(c=>c.name.toLowerCase()===name.toLowerCase());if(!Array.isArray(e.sets)||!e.sets.length||e.sets.length>100)throw Error('Each exercise needs 1–100 sets.');total+=e.sets.length;if(total>20000)throw Error('Import up to 20,000 sets at a time.');return {id:match?.id||'imported-'+encodeURIComponent(name.toLowerCase()),name,sets:e.sets.map(s=>{const reps=number(s.reps,1,1000,'reps');if(!Number.isInteger(reps))throw Error('Reps must be whole numbers.');return {kg:number(s.kg,0,1000,'weight'),reps,rir:s.rir==null?null:number(s.rir,0,10,'RIR'),done:true};})};})};});
}
function unique(incoming,existing){const seen=new Set(existing.map(key));let duplicates=0;const workouts=incoming.filter(w=>{const k=key(w);if(seen.has(k)){duplicates++;return false;}seen.add(k);return true;});return {workouts,duplicates};}
const api={parse,unique};if(typeof module!=='undefined')module.exports=api;else root.ForgeWorkoutImport=api;
})(typeof window==='undefined'?globalThis:window);
