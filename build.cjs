const fs=require('node:fs'),path=require('node:path');
const out=path.join(__dirname,'dist');fs.mkdirSync(out,{recursive:true});
for(const file of ['index.html','workout-import.js','workout-import-template.csv','privacy.html','styles.css','app.js','config.js','personalization.js','profile-ui.js','accounts.js','favicon.svg'])fs.copyFileSync(path.join(__dirname,file),path.join(out,file));
for(const dir of ['vendor','assets'])fs.cpSync(path.join(__dirname,dir),path.join(out,dir),{recursive:true});
console.log('FORGE static build ready');
