(function(root){
'use strict';
const catalog = [
 ['bb-bench-press','Barbell Bench Press','Chest','barbell','press'],
 ['incline-db-press','Incline Dumbbell Press','Chest','dumbbells','press'],
 ['push-up','Push-up','Chest','bodyweight','press'],
 ['machine-chest-press','Machine Chest Press','Chest','machines','press'],
 ['chest-supported-row','Chest-Supported Row','Back','machines','row'],
 ['db-row','Supported Dumbbell Row','Back','dumbbells','row'],
 ['band-row','Resistance Band Row','Back','bands','row'],
 ['lat-pulldown-wide','Lat Pulldown','Back','machines','pull'],
 ['band-pulldown','Band Pulldown','Back','bands','pull'],
 ['bb-squat','Barbell Squat','Quads','barbell','squat'],
 ['goblet-squat','Goblet Squat','Quads','dumbbells','squat'],
 ['bodyweight-squat','Bodyweight Squat','Quads','bodyweight','squat'],
 ['leg-press','Leg Press','Quads','machines','knee'],
 ['leg-extension','Leg Extension','Quads','machines','knee'],
 ['romanian-deadlift','Romanian Deadlift','Hamstrings','barbell','hinge'],
 ['db-rdl','Dumbbell Romanian Deadlift','Hamstrings','dumbbells','hinge'],
 ['seated-leg-curl','Seated Leg Curl','Hamstrings','machines','curl'],
 ['band-leg-curl','Band Leg Curl','Hamstrings','bands','curl'],
 ['glute-bridge','Glute Bridge','Glutes','bodyweight','bridge'],
 ['hip-thrust','Machine Hip Thrust','Glutes','machines','bridge'],
 ['lateral-raise','Cable Lateral Raise','Side delts','machines','raise'],
 ['db-lateral-raise','Dumbbell Lateral Raise','Side delts','dumbbells','raise'],
 ['machine-shoulder-press','Machine Shoulder Press','Front delts','machines','overhead'],
 ['db-shoulder-press','Dumbbell Shoulder Press','Front delts','dumbbells','overhead'],
 ['cable-rear-delt-fly','Cable Rear Delt Fly','Rear delts','machines','row'],
 ['band-pull-apart','Band Pull-apart','Rear delts','bands','row'],
 ['cable-triceps-pushdown','Rope Triceps Pushdown','Triceps','machines','triceps'],
 ['band-pushdown','Band Triceps Pushdown','Triceps','bands','triceps'],
 ['db-triceps','Dumbbell Triceps Extension','Triceps','dumbbells','overhead'],
 ['cable-curl','Cable Biceps Curl','Biceps','machines','biceps'],
 ['db-curl','Dumbbell Biceps Curl','Biceps','dumbbells','biceps'],
 ['band-curl','Band Biceps Curl','Biceps','bands','biceps'],
 ['standing-calf-raise','Standing Calf Raise','Calves','bodyweight','calves'],
 ['dead-bug','Dead Bug','Core','bodyweight','core']
].map(([id,name,muscle,equipment,pattern])=>({id,name,muscle,equipment,pattern}));
const weekdays=['MON','TUE','WED','THU','FRI','SAT','SUN'];
const styles={bodybuilding:'Bodybuilding / hypertrophy',powerlifting:'Powerlifting',general:'Healthy and strong',functional:'Functional fitness',calisthenics:'Calisthenics',olympic:'Olympic weightlifting',athletic:'Sport-specific'};
const groups=[['squat','Squats'],['knee','Knee-dominant work'],['hinge','Deadlifts / hip hinges'],['overhead','Overhead work'],['press','Chest pressing'],['pull','Vertical pulling'],['row','Rows'],['bridge','Bridges'],['core','Core'],['calves','Calf work'],['raise','Lateral raises'],['curl','Leg curls'],['triceps','Triceps'],['biceps','Biceps'],['jump','Jumping']];
catalog.push(...[
 ['deadlift','Conventional Deadlift','Hamstrings','barbell','hinge'],['pull-up','Pull-up','Back','pullup','pull'],['band-chest-press','Band Chest Press','Chest','bands','press'],['pike-push-up','Pike Push-up','Front delts','bodyweight','overhead'],['sliding-leg-curl','Sliding Leg Curl','Hamstrings','sliders','curl'],['split-squat','Split Squat','Quads','bodyweight','squat'],['hang-clean','Hang Power Clean — technique','Power','olympic','hinge'],['snatch','Hang Power Snatch — technique','Power','olympic','overhead'],['squat-jump','Low Squat Jump','Power','bodyweight','jump']
].map(([id,name,muscle,equipment,pattern])=>({id,name,muscle,equipment,pattern})));
const textOK=x=>typeof x==='string'&&x.trim().length>0&&x.length<=500;
function validate(p){
 const e=[];
 if(!textOK(p.name)||p.name.length>60)e.push('Enter your name (1–60 characters).');
 if(!Number.isInteger(p.age)||p.age<18||p.age>100)e.push('Enter your age (18–100).');
 if(!Number.isFinite(p.bodyKg)||p.bodyKg<35||p.bodyKg>350)e.push('Enter your weight (35–350 kg).');
 if(!Number.isFinite(p.heightCm)||p.heightCm<120||p.heightCm>230)e.push('Enter your height (120–230 cm).');
 if(!['female','male','skip'].includes(p.formula))e.push('Choose the sex-based equation or explicitly skip calorie estimates.');
 if(![1.2,1.375,1.55,1.725].includes(p.activity))e.push('Choose your overall activity level.');
 if(!['unknown','known'].includes(p.bodyFatStatus)||(p.bodyFatStatus==='known'&&(!Number.isFinite(p.bodyFat)||p.bodyFat<3||p.bodyFat>65)))e.push('Enter body fat (3–65%) or choose unknown.');
 if(!['beginner','novice','intermediate','advanced'].includes(p.experience))e.push('Confirm your training age.');
 if(!Object.hasOwn(styles,p.style))e.push('Choose the training style you enjoy.');
 if(!['cut','maintain','bulk','cardio','hybrid'].includes(p.goal))e.push('Choose your primary goal.');
 if(['cardio','hybrid'].includes(p.goal)&&!['cut','maintain','bulk'].includes(p.energyGoal))e.push('Choose your weight direction alongside conditioning.');
 if(energyGoal(p)==='bulk'&&!['lean','aggressive'].includes(p.bulkType))e.push('Choose lean or faster bulk.');
 if(!textOK(p.measure))e.push('Describe how you will measure your goal.');
 if(![2,3,4,5,6].includes(p.days)||!Array.isArray(p.weekdays)||p.weekdays.length!==p.days||new Set(p.weekdays).size!==p.days||p.weekdays.some(d=>!weekdays.includes(d)))e.push('Select the exact training days matching your weekly availability.');
 if(p.experience==='beginner'&&p.days>4)e.push('For a true beginner, choose 2–3 full-body days or 4 upper/lower days; keep other days for recovery.');
 if(![30,45,60,75,90].includes(p.minutes))e.push('Choose your session length.');
 if(!textOK(p.constraints))e.push('Describe scheduling constraints, or enter none.');
 if(!['gym','home','bodyweight','bands'].includes(p.equipmentMode)||!Array.isArray(p.equipment)||p.equipment.some(x=>!['barbell','dumbbells','machines','bands','pullup','sliders','olympic'].includes(x)))e.push('Confirm your equipment setting and inventory.');
 if(p.equipmentMode==='bodyweight'&&p.equipment?.length)e.push('Bodyweight-only equipment must be empty.');
 if(p.equipmentMode==='bands'&&(p.equipment?.length!==1||p.equipment[0]!=='bands'))e.push('Bands-only equipment must include only bands.');
 if(['gym','home'].includes(p.equipmentMode)&&!p.equipment?.length)e.push('Confirm your available equipment.');
 if(p.equipmentMode==='home'&&!textOK(p.equipmentNotes))e.push('List your home equipment and available loads.');
 if(!['none','limited'].includes(p.injuryStatus)||!textOK(p.injuries))e.push('Confirm injuries, pain and movement limitations (or none).');
 if(p.injuryStatus==='limited'&&(!Array.isArray(p.safeExercises)||!p.safeExercises.length))e.push('Select only exercises you know are currently pain-free and permitted for your limitations.');
 if(!textOK(p.historyNotes)||!textOK(p.enjoyed)||!textOK(p.disliked))e.push('Describe your history, what worked and what you disliked (none is okay).');
 if(!p.exclusionsConfirmed)e.push('Confirm that painful and unwanted exercises have been excluded.');
 if(!['none','walking','running','cycling','rowing','swimming'].includes(p.cardio))e.push('Choose a cardio preference, including none if you prefer none.');
 if(!Number.isFinite(p.cardioBaseline)||p.cardioBaseline<0||p.cardioBaseline>300)e.push('Enter your current comfortable cardio duration (0–300 minutes).');
 if(p.cardio!=='none'&&(!Array.isArray(p.cardioDays)||p.cardioDays.length<1||p.cardioDays.some(d=>!weekdays.includes(d))))e.push('Choose days when cardio fits.');
 if(['cardio','hybrid'].includes(p.goal)&&p.cardio==='none')e.push('Choose an acceptable cardio modality for a conditioning goal. Walking is an option.');
 if(p.style==='olympic'&&(!p.equipment?.includes('olympic')||p.technicalReady!=='yes'))e.push('Olympic programming needs a platform, bumper plates and confirmed coached technique; choose another style until these are available.');
 if(p.style==='powerlifting'&&!p.equipment?.includes('barbell'))e.push('Powerlifting requires a barbell, rack and bench. Choose general strength if these are unavailable.');
 if(p.style==='calisthenics'&&!['knee','standard','archer'].includes(p.pushLevel))e.push('Choose your current controlled push-up progression.');
 if(p.style==='athletic'&&(!textOK(p.sport)||!['base','power','season'].includes(p.season)||!textOK(p.seasonTiming)))e.push('Enter your sport, phase and season timing.');
 if(p.experience==='advanced'&&(!Array.isArray(p.focus)||p.focus.length<1||p.focus.length>2||p.focus.some(m=>!['Chest','Back','Quads','Hamstrings','Side delts'].includes(m))))e.push('Choose one or two muscles for your specialization block.');
 return e;
}
function energyGoal(p){return ['cardio','hybrid'].includes(p.goal)?p.energyGoal:p.goal;}
function calories(p){
 if(validate(p).length||p.formula==='skip'||!p.calorieEligible)return null;
 const resting=10*p.bodyKg+6.25*p.heightCm-5*p.age+(p.formula==='male'?5:-161),maintenance=Math.round(resting*p.activity);
 const lean=p.bodyFatStatus!=='known'||p.bodyFat<=(p.formula==='male'?15:25);
 const high=p.bodyFatStatus==='known'&&p.bodyFat>=(p.formula==='male'?25:35);
 const surplus=p.bulkType==='aggressive'&&!high&&p.bodyFatStatus==='known'&&lean?.2:.1;
 const deficit=lean?.15:high?.25:.2,goal=energyGoal(p);
 const cut=Math.round(maintenance*(1-deficit)),bulk=Math.round(maintenance*(1+surplus));
 const base=({cut,maintain:maintenance,bulk})[goal];
 const override=p.coachAdjustment;
 const target=override&&override.goal===goal&&Number.isFinite(override.target)?override.target:base;
 if(target<(p.formula==='male'?1500:1200)||target>6000)return {review:true};
 return {resting:Math.round(resting),maintenance,cut,bulk,target,base,deficit,surplus,protein:Math.round(p.bodyKg*(goal==='cut'?2.2:1.8)),rate:goal==='bulk'?[.25,.5]:goal==='cut'?(lean?[-.5,-.25]:[-1,-.5]):[-.15,.15],adjusted:target!==base};
}
function allowed(e,p){
 return (e.equipment==='bodyweight'||p.equipment?.includes(e.equipment))&&!p.excluded?.includes(e.id)&&!p.avoid?.includes(e.pattern)&&(p.injuryStatus!=='limited'||p.safeExercises?.includes(e.id));
}
function splitInfo(input){
 const p=typeof input==='object'?input:{days:input},n=p.days||3;
 const sessions=n<=3?Array.from({length:n},(_,i)=>'Full Body '+String.fromCharCode(65+i)):n===4?['Upper A','Lower A','Upper B','Lower B']:n===5?['Push','Pull','Legs','Upper','Lower']:['Push A','Pull A','Legs A','Push B','Pull B','Legs B'];
 return {name:n<=3?'Full body':n===4?'Upper / Lower':'Push / Pull / Legs',sessions,description:p.experience==='advanced'?'A specialization block with RPE-based loading.':p.experience==='intermediate'?'Heavy and moderate sessions, followed by a planned deload.':'Repeat a small set of movements and build technique before load.'};
}
function makePlan(p){
 if(validate(p).length)return [];
 const week=Math.min(5,Math.max(1,Number(p.blockWeek)||1)),deload=!!p.recoveryWeek||week===5&&!['beginner','novice'].includes(p.experience),n=p.days;
 const pool=catalog.filter(e=>allowed(e,p)).filter(e=>p.style==='calisthenics'?['bodyweight','pullup','bands','sliders'].includes(e.equipment):true);
 const full=['Quads','Chest','Back','Hamstrings','Side delts','Core'],upper=['Chest','Back','Side delts','Triceps','Biceps'],lower=['Quads','Hamstrings','Glutes','Calves','Core'];
 const groupsByDay=n<=3?Array.from({length:n},()=>full):n===4?[upper,lower,upper,lower]:n===5?[['Chest','Side delts','Triceps'],['Back','Biceps','Core'],lower,upper,lower]:[['Chest','Side delts','Triceps'],['Back','Biceps','Core'],lower,['Chest','Side delts','Triceps'],['Back','Biceps','Core'],lower];
 const names=splitInfo(p).sessions,days=weekdays.filter(d=>p.weekdays.includes(d));
 const plan=groupsByDay.map((muscles,i)=>{
  const exercises=[],missing=[];let remaining=p.minutes-7;
  const add=(e,sets,min,max,rest,rpe,note)=>{
   const cost=2+sets*(.7+rest/60);if(remaining<cost)return false;remaining-=cost;
   exercises.push({...e,sets,min,max,rest,rpe,fst:false,note:note+' Stop if painful. RPE '+rpe+' means about '+(10-rpe)+' reps in reserve.'});return true;
  };
  if(p.style==='olympic'){
   const e=pool.find(e=>e.id===(i%2?'snatch':'hang-clean'));if(e)add(e,deload?2:3,2,3,120,6,'Technique first: crisp repetitions, no grinding.');else missing.push('Olympic technique (excluded)');
  }
  if(p.style==='athletic'&&p.season==='power'){
   const e=pool.find(e=>e.id==='squat-jump');if(e)add(e,deload?1:3,3,3,90,6,'Power phase: reset fully between jumps; stop when jump height or landing quality drops.');else missing.push('Power work (excluded)');
  }
  const ordered=[...muscles].sort((a,b)=>(p.focus?.includes(b)?1:0)-(p.focus?.includes(a)?1:0));
  for(const muscle of ordered){
   let choices=pool.filter(e=>e.muscle===muscle);
   const preferred=p.style==='powerlifting'?{Chest:'bb-bench-press',Quads:'bb-squat',Hamstrings:'deadlift'}:{Chest:'push-up',Quads:'bodyweight-squat',Back:'pull-up'};
   if(p.style==='functional'){const mixed={Chest:i%2?'bb-bench-press':'push-up',Quads:i%2?'split-squat':'bb-squat',Back:i%2?'pull-up':'db-row',Hamstrings:'romanian-deadlift'};choices.sort((a,b)=>(b.id===mixed[muscle]?1:0)-(a.id===mixed[muscle]?1:0));}
   if(['powerlifting','calisthenics'].includes(p.style))choices.sort((a,b)=>(b.id===preferred[muscle]?1:0)-(a.id===preferred[muscle]?1:0));
   if(!['powerlifting','calisthenics','functional'].includes(p.style))choices.sort((a,b)=>(p.preferredExercises?.includes(b.id)?1:0)-(p.preferredExercises?.includes(a.id)?1:0));
   let chosen=choices[0];if(!chosen){missing.push(muscle+' (equipment or exclusions)');continue;}
   if(chosen.id==='push-up'&&p.style==='calisthenics')chosen={...chosen,id:'push-up-'+p.pushLevel,name:({knee:'Knee Push-up',standard:'Push-up',archer:'Archer Push-up'})[p.pushLevel]};
   const compound=['press','row','pull','squat','hinge','overhead','knee','bridge'].includes(chosen.pattern);
   const novice=['beginner','novice'].includes(p.experience),heavy=compound&&chosen.equipment!=='bodyweight'&&(p.style==='powerlifting'||(p.trainingGoal==='strength'&&i%2===0));
   let min=heavy?4:8,max=heavy?6:12;
   if(p.experience==='intermediate'&&compound&&!heavy){min=i<Math.ceil(n/2)?6:10;max=i<Math.ceil(n/2)?10:15;}
   if(p.experience==='intermediate'&&heavy&&i>=Math.ceil(n/2)){min=8;max=12;}
   if(p.experience==='advanced'&&heavy){min=week<=2?5:3;max=week<=2?6:5;}
   if(p.style==='bodybuilding'&&!compound){min=10;max=15;}
   let rpe=deload?6:novice?7:Math.min(9,7+Math.floor((week-1)/2));
   const freq=groupsByDay.filter(g=>g.includes(muscle)).length;
   let weeklyTarget=novice?(p.experience==='beginner'?6:8):p.experience==='advanced'?(p.focus.includes(muscle)?16+(week-1)*1:6):12;
   if(['Core','Calves','Triceps','Biceps','Glutes','Side delts'].includes(muscle)&&!p.focus?.includes(muscle))weeklyTarget=Math.min(weeklyTarget,6);
   if(p.goal==='cardio'||p.style==='athletic'&&p.season==='season')weeklyTarget=6;
   let sets=Math.min(p.experience==='advanced'&&p.focus?.includes(muscle)?10:8,Math.ceil(weeklyTarget/freq));if(deload)sets=Math.max(1,Math.ceil(sets*.5));
   const rest=heavy?180:compound?120:60;
   // Reserve time for the remaining movements; never promise volume that does not fit.
   const remainingMuscles=ordered.length-ordered.indexOf(muscle);
   const budget=remaining-(remainingMuscles-1)*7.4;
   sets=Math.min(sets,Math.max(1,Math.floor((budget-2)/(.7+rest/60))));
   if(!add(chosen,sets,min,max,rest,rpe,heavy?'Use the same main lift throughout this block.':'Controlled repetitions through your comfortable range.'))missing.push(muscle+' (session time)');
  }
  return {id:'personal-'+i,name:names[i],short:days[i],weekday:days[i],focus:exercises.map(e=>e.muscle).filter((x,i,a)=>a.indexOf(x)===i).join(' · '),minutes:p.minutes,exercises,missing,week,deload};
 });return plan;
}
function suggestedLoad(exercise,history){
 for(const w of [...history].sort((a,b)=>new Date(b.date)-new Date(a.date))){const e=w.entries?.find(e=>e.id===exercise.id);if(!e?.sets?.length)continue;
 const sets=e.sets.filter(s=>s.done&&Number.isFinite(s.kg));if(!sets.length)continue;
 const kg=sets[0].kg;return {kg,eligibleIncrease:sets.length>=exercise.sets&&sets.every(s=>s.kg===kg&&s.reps>=exercise.max&&Number.isFinite(s.rir)&&s.rir>=10-(exercise.rpe||8))};}return null;
}
function cardioPlan(p){
 if(p.cardio==='none')return 'You prefer no cardio. None is scheduled. If you become open to it, start with an enjoyable easy activity; the general starting suggestion is 2–3 × 20–40 minutes.';
 const w=Math.min(5,p.blockWeek||1),focused=['cardio','hybrid'].includes(p.goal),base=Math.min(40,Math.max(5,p.cardioBaseline||5));
 const duration=w===5?Math.max(5,Math.round(base*.75)):Math.min(60,base+(focused?5:2)*(w-1));
 return `${p.cardioDays.join(', ')}: ${p.cardio}, ${duration} minutes at a conversational effort. Your starting capacity is ${p.cardioBaseline} minutes. ${focused?'Add 5 minutes per session each week through week 4 only if recovered; week 5 is easier.':'Build toward 20–40 minutes, 2–3 times weekly as tolerated.'} ${energyGoal(p)==='bulk'||p.style==='powerlifting'?'Keep it easy and several hours apart from lifting where possible.':'After lifting or on a separate day; reduce duration if leg performance or recovery declines.'} Do not count these calories again in your food target.`;
}
function progression(p){
 const base=p.style==='calisthenics'?'At the top of all rep ranges with 2 reps in reserve for two sessions, progress knee → standard → archer push-ups, then rebuild from the lower rep bound. Keep the harder variation controlled; record the new level in your profile.':'When all sets hit the top of the range at the prescribed RPE, add the smallest available load (about 1–2.5% upper body or 2.5–5% lower body), then return to the bottom of the rep range. If your equipment cannot make that jump, add one rep per set first.';
 if(p.experience==='beginner'||p.experience==='novice')return `Weeks 1–6: repeat this split; ${base} Aim for one extra rep per set each ${p.experience==='beginner'?'session':'week'} before increasing load. Technique comes first. Two failed sessions: repeat or reduce the load 5–10% and review sleep/adherence.`;
 return `Weeks 1–2: ${p.experience==='advanced'?'start the specialization block at its lower volume':'alternate heavy and moderate days'}. Weeks 3–4: ${p.experience==='advanced'?'increase focus-muscle sets only if recovered, with lower-rep main lifts':'build reps or load while keeping the same exercise selection'}. Week 5: halve working sets and use RPE 6. Week 6: repeat week 1 using your latest successful loads. ${base} Select the week below after reviewing recovery; do not advance through pain or declining performance.`;
}
function summary(p){return `${p.name}, your ${styles[p.style]} plan supports “${p.measure}” with ${p.days} sessions on ${p.weekdays.join(', ')} lasting up to ${p.minutes} minutes. Your ${p.experience} training age sets the progression. Equipment: ${p.equipment.length?p.equipment.join(', '):'bodyweight only'}${p.equipmentNotes?' — '+p.equipmentNotes:''}. Schedule: ${p.constraints}. History: ${p.historyNotes}. What worked: ${p.enjoyed}. What you want to avoid: ${p.disliked}. Movement limits: ${p.injuries}. ${p.style==='athletic'?'Sport: '+p.sport+'; '+p.season+' phase; '+p.seasonTiming+'. ':''}${energyGoal(p)==='maintain'?'Recomp is gradual, especially beyond beginner or return-to-training stages.':''}`;}
function volume(p){const counts={};for(const d of makePlan(p))for(const e of d.exercises)counts[e.muscle]=(counts[e.muscle]||0)+e.sets;return counts;}
function checkIn(p,weights,history,input,now=Date.now()){
 const c=calories(p),day=86400000,end=new Date(now);end.setHours(0,0,0,0);const endMs=+end;
 const unique=[...new Map(weights.map(x=>[x.date,x])).values()];
 const logs=unique.filter(x=>Number.isFinite(x.kg)&&x.kg>=35&&x.kg<=350).map(x=>({...x,t:+new Date(x.date+'T12:00:00')}));
 const current=logs.filter(x=>x.t>=endMs-6*day&&x.t<endMs+day),prior=logs.filter(x=>x.t>=endMs-13*day&&x.t<endMs-6*day);
 const average=a=>a.reduce((s,x)=>s+x.kg,0)/a.length;
 let rate=null,adjustment=null,messages=[];
 const sorted=history.filter(w=>new Date(w.date)<=now).slice().sort((a,b)=>new Date(b.date)-new Date(a.date));
 let comparison=null;
 for(const w of sorted){for(const e of w.entries||[]){const prev=sorted.find(z=>new Date(z.date)<new Date(w.date)&&z.entries?.some(a=>a.id===e.id));if(!prev)continue;const old=prev.entries.find(a=>a.id===e.id);const score=a=>Math.max(0,...a.sets.filter(s=>s.done&&s.kg>0&&s.reps>0&&s.reps<=12).map(s=>s.kg*(1+s.reps/30)));const a=score(e),b=score(old);if(a&&b){comparison={name:e.name,change:(a/b-1)*100};break;}}if(comparison)break;}
 if(comparison)messages.push(`${comparison.name}: estimated strength changed ${comparison.change.toFixed(1)}% versus the previous logged session (load × (1 + reps/30), comparable technique assumed). Expected: stable or gradually improving while hitting prescribed reps/RPE.`);else messages.push('Log two comparable loaded sessions to compare lift progression; bodyweight progress is assessed by your reported reps/variation.');
 if(input.pain==='yes')messages.push('New pain: stop the affected movements and update your safe exercise list before continuing. Do not progress the block.');
 else if(input.adherence==='low')messages.push('Adherence comes first: repeat the current week and make the schedule achievable before changing calories or volume.');
 else if(input.recovery==='poor')messages.push('Recovery is limiting progress: use a recovery week with half the working sets at RPE 6, keep cardio easy, and review sleep.');
 else if(input.performance==='stalled'||comparison&&comparison.change<-2)messages.push('Repeat the week and check technique and comparable loads. If two more well-recovered, consistent exposures stall, reduce working load 5–10%; keep the same exercises.');
 else messages.push('Recovery and adherence support continuing the existing progression. Keep the same plan.');
 if(current.length<3||prior.length<3)messages.push('Need at least three weigh-ins in each of two consecutive weeks before adjusting food. Keep the current target.');
 else if(c&&!c.review){rate=(average(current)/average(prior)-1)*100;messages.push(`Weight trend: ${rate.toFixed(2)}%/week; target ${c.rate[0]} to ${c.rate[1]}%/week. Two 7-day averages: ${average(prior).toFixed(1)} → ${average(current).toFixed(1)} kg.`);
  const recent=p.coachAdjustment&&now-new Date(p.coachAdjustment.date)<14*day;
  if(!recent&&input.adherence==='high'&&input.recovery==='good'&&input.pain==='no'){
   const factor=rate<c.rate[0]?1.05:rate>c.rate[1]?.95:1;const target=Math.round(c.target*factor);
   const floor=p.formula==='male'?1500:1200;
   if(factor!==1&&target>=floor&&target<=6000){adjustment={target,goal:energyGoal(p),date:new Date(now).toISOString()};messages.push(`Suggested next target: ${target} kcal/day (${factor>1?'+':'−'}5% from ${c.target}). Keep protein at ${c.protein} g. Review for 14 days before another adjustment.`);}
  }else messages.push(recent?'Give the last calorie adjustment 14 days before changing again.':'Hold calories while resolving pain, recovery or inconsistent adherence.');
  if(rate<-1)messages.push('Loss exceeds 1% per week: faster loss can increase the risk of losing muscle; review recovery and the deficit.');
 }
 return {messages,adjustment,rate,comparison};
}
root.ForgePersonal={catalog,groups,styles,weekdays,validate,calories,allowed,splitInfo,makePlan,suggestedLoad,summary,progression,cardioPlan,volume,checkIn,energyGoal};
if(typeof module!=='undefined')module.exports=root.ForgePersonal;
})(typeof window!=='undefined'?window:globalThis);
