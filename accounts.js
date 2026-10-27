/* Google OAuth through Supabase. Account state is stored under RLS, never under a shared browser key. */
window.ForgeAccount = (()=>{
 const config=window.FORGE_CONFIG||{};
 const enabled=!!(config.supabaseUrl&&config.supabasePublishableKey);
 const client=enabled?supabase.createClient(config.supabaseUrl,config.supabasePublishableKey,{auth:{flowType:'pkce',storage:sessionStorage,persistSession:true,detectSessionInUrl:true}}):null;
 let user=null,loadingUser=null,revision=0,pending=null,draining=null,blocked=false,sessionEpoch=0,status='Local preview',listener=()=>{};
 const publish=text=>{status=text;document.querySelectorAll('[data-sync-status]').forEach(e=>e.textContent=text);};
 async function load(current){
  if(loadingUser===current.id)return;loadingUser=current.id;
  const epoch=++sessionEpoch; user=null;pending=null;blocked=false;publish('Loading your account…');
  const {data,error}=await client.from('forge_accounts').select('state,revision').eq('user_id',current.id).maybeSingle();
  if(epoch!==sessionEpoch)return;
  if(error){loadingUser=null;blocked=true;publish('Account could not load. Try signing in again.');listener(null,null,error);return;}
  let row=data;
  if(!row){const result=await client.from('forge_accounts').insert({user_id:current.id,state:{},revision:0}).select('state,revision').single();if(result.error){loadingUser=null;blocked=true;publish('Account setup failed. Please retry.');listener(null,null,result.error);return;}row=result.data;}
  if(epoch!==sessionEpoch)return;
  loadingUser=null;revision=row.revision;user=current;publish('Saved to your account');listener(current,row.state,null);
 }
 async function init(callback){listener=callback;if(!client)return callback(null,null,null);
  client.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'){sessionEpoch++;loadingUser=null;user=null;pending=null;blocked=false;publish('Signed out');callback(null,null,null);}else if(event==='SIGNED_IN'&&session?.user?.id!==user?.id){setTimeout(()=>load(session.user),0);}});
  const {data,error}=await client.auth.getSession();if(error)return callback(null,null,error);
  if(data.session)await load(data.session.user);else callback(null,null,null);
 }
 async function login(){if(!client)throw Error('Google sign-in is not connected yet.');const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname,queryParams:{prompt:'select_account'}}});if(error)throw error;}
 function save(state){if(!user)return false;pending=structuredClone(state);if(blocked)return false;publish('Saving…');if(!draining)draining=drain().finally(()=>{draining=null;});return true;}
 async function drain(){const epoch=sessionEpoch;while(pending&&user&&!blocked&&epoch===sessionEpoch){const snapshot=pending;pending=null;const uid=user.id;
  const {data,error}=await client.from('forge_accounts').update({state:snapshot,revision:revision+1}).eq('user_id',uid).eq('revision',revision).select('revision').maybeSingle();
  if(epoch!==sessionEpoch)return;
  if(error||!data){pending=pending||snapshot;blocked=true;publish(error?'Not synced. Keep this tab open and retry.':'Changed on another device. Export a backup, then reload.');return;}
  revision=data.revision;
 }if(!pending&&!blocked)publish('Saved to your account');}
 async function retry(){if(!user)return;const {data,error}=await client.from('forge_accounts').select('revision').eq('user_id',user.id).single();if(error||data.revision!==revision){publish('Changed on another device. Export a backup, then reload.');return;}blocked=false;if(!draining)draining=drain().finally(()=>draining=null);await draining;}
 async function logout(){if(draining)await draining;if(pending||blocked)throw Error('Your latest changes are not synced. Retry sync or export a backup before signing out.');const {error}=await client.auth.signOut({scope:'local'});if(error)throw error;}
 window.addEventListener('beforeunload',e=>{if(pending||draining){e.preventDefault();e.returnValue='';}});
 return {enabled,init,login,save,retry,logout,get user(){return user;},get status(){return status;}};
})();
