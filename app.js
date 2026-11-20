'use strict';
const STARTING_THRUSTS_ID = 0;
const info={
[STARTING_THRUSTS_ID]: ['Gameplay', 'Start with both thrusts', 'Link starts a new save with Up Thrust and Down Thrust. The sword trainers recognize the moves he already knows.'],
1:['Gameplay','Auto Fairy','If Link knows Fairy and has enough magic, he casts it automatically on certain deadly tiles.'],
2:['Audio','Minor-item pickup sound','Use a quieter pickup cue for minor items.'],
3:['Audio','Alternate text sound','Replace the dialogue tick with an alternate cue.'],
4:['Gameplay','Fairy needs a key','Fairy can no longer pass a locked door without a key. A valid key still opens it.'],
5:['Gameplay','Faster elevators','Increase elevator travel speed.'],
7:['Progression','FDS experience thresholds','Use the experience requirements from the Japanese Famicom Disk System release.'],
8:['Progression','Keep XP on continue','Carry your current experience points through Game Over when you choose Continue.'],
9:['Gameplay','Longer sword','Increase the sword’s reach.'],
10:['Progression','Manual level-ups','Press Up + Start to purchase a level manually instead of opening the level-up menu automatically.'],
12:['Audio','FDS battle music only','Always use the Famicom Disk System battle theme.'],
13:['Audio','NES battle music only','Always use the NES battle theme.'],
15:['Gameplay','Original drops','Restore the original enemy drop behavior.'],
16:['Gameplay','Temporary Link Dolls','Picked-up dolls add a life for the current run, not to your permanent starting lives.'],
17:['Progression','Original restart','Use the original Game Over restart behavior.'],
18:['Progression','Original spell costs','Restore the original magic costs for spells.'],
20:['Visual','Original title palette','Restore the classic title-screen colors.'],
22:['Audio','Random battle music','Let the game choose between the NES and FDS battle themes.'],
24:['Audio','Disable low-health beep','Turn off the recurring low-health warning.'],
25:['Audio','Mute dialogue ticks','Turn off the sound that plays as dialogue appears.'],
28:['Progression','Restart on the same screen','Continue from the same screen and keep XP.'],
29:['Gameplay','Run','Hold A or B while moving left or right in a side-scrolling area.'],
30:['Progression','Restart on the same continent','After Game Over, restart on the continent where Link lost his last life.'],
31:['Progression','Fixed crystal XP','Award a fixed amount of XP when placing a crystal, based on the palace.'],
35:['Visual','Red Shield at Life 7','The Shield spell turns Link red starting at Life level 7.']
};
const unavailable=[
 [6,'Gameplay','FDS King’s Tomb','Alternate King’s Tomb layout from the Famicom Disk System version. Room and collision conversion pending.'],
 [11,'Visual','New graphics','Alternate artwork. Requires locally supplied assets and SNES conversion.'],
 [14,'Gameplay','Original enemy attributes','Restore the original enemy stats and experience behavior. SNES adaptation pending.'],
 [19,'Visual','Original title sword and palette','Restore both pieces of the original title art. The sword requires locally supplied assets.'],
 [21,'Visual','Original title sword','Restore the original sword without changing the colors. Requires locally supplied assets.'],
 [23,'Gameplay','Upstream lag reduction','This NES timing patch is excluded from the SNES build.'],
 [26,'Visual','Revility graphics','Alternate graphics set. Requires locally supplied assets and SNES conversion.'],
 [27,'Visual','Reworked title screen','Alternate title composition. Requires locally supplied title assets and SNES conversion.'],
 [32,'Visual','Original NES graphics','Original NES look. Requires locally supplied assets and SNES conversion.'],
 [33,'Progression','Old magic-container save repair','A separate repair for older save files affected by the magic-container bug.'],
 [34,'Gameplay','Secret','An optional room change from the NES version. Its behavior on SNES is unverified.']
];
const groups=[[3,25],[12,13,22],[17,28,30],[8,10,31],[7,10,31]];
const key=ids=>[...ids].map(Number).sort((a,b)=>a-b).join(',');
const bySelection=new Map(CATALOG.variants.map(v=>[key(v.ids),v]));
const $=id=>document.getElementById(id);
const selected=new Set();
let filter = 'All', reduxBase = null, busy = false, inputToken = 0, lastSelection = '';
function conflicts(){
 for(const group of groups){const clash=group.filter(x=>selected.has(x));if(clash.length>1)return clash.map(x=>info[x][1]).join(' and ')+' can’t be used together.'}
 return '';
}
function current() {
 const variantKey = key([...selected].filter(id => id !== STARTING_THRUSTS_ID));
 if (!variantKey) return null; // Suggested Redux can also be paired with the thrusts.
 return bySelection.get(variantKey) || SUGGESTED_COMBINATIONS[variantKey];
}
const defaultReversals=new Map([[12,17],[16,18],[18,15],[23,16]]);
const revertLabels={12:'Uses the original Game Over restart instead.',16:'Uses the original magic costs instead.',18:'Uses the original item drop rates instead.',23:'Link Dolls grant a life for this run only.'};
function resetSuggested(){
 selected.clear();$('preset').value='suggested';$('buildStatus').textContent='';refresh();
}
$('resetSuggested').addEventListener('click',resetSuggested);
function refreshSuggested(){
 const active=$('suggested-switches'), fixed=$('suggested-fixed');
 active.replaceChildren(); fixed.replaceChildren();
 for(const [id,name,state] of SUGGESTED_REDUX){
  const reverse=defaultReversals.get(id);
  if(reverse&&bySelection.has(String(reverse))){
   const row=document.createElement('label'), box=document.createElement('input'), body=document.createElement('span'), title=document.createElement('strong'), desc=document.createElement('small');
   const opposites=id===12?[17,28,30]:[reverse], alternate=opposites.find(o=>selected.has(o));
   row.className='redux-switch';box.type='checkbox';box.setAttribute('role','switch');box.checked=!alternate;box.dataset.core=String(id);
   title.textContent=name;desc.textContent=box.checked?'On by default.':alternate===reverse?revertLabels[id]:'Replaced by '+info[alternate][1]+'.';
   box.addEventListener('change',()=>{if(box.checked){for(const other of opposites)selected.delete(other)}else selected.add(reverse);$('preset').value=selected.size?'':'suggested';refresh();$('suggested-switches').querySelector('[data-core="'+id+'"]')?.focus({preventScroll:true})});
   body.append(title,desc);row.append(box,body);active.append(row);
  } else {
   const row=document.createElement('li'), text=document.createElement('span'), tag=document.createElement('small');
   text.textContent=name;tag.textContent=state==='On'?'Included':state==='Partial'?'In some areas':'Modified';row.append(text,tag);fixed.append(row);
  }
 }
}
const presets=$('preset');
for(const v of CATALOG.variants){
 if(v.ids.length<2||!v.slug.startsWith('Shared-')||v.slug==='Shared-Gameplay'||v.slug==='Shared-Options')continue;
 const core=CATALOG.variants.find(c=>c.slug=== (v.file.includes('_R1_')?'Shared-Options':'Shared-Gameplay'));
 const extra=v.ids.find(id=>!core.ids.includes(id));
 if(!extra)continue;
 const entry=document.createElement('option');entry.value=v.slug;entry.textContent=(v.file.includes('_R1_')?'Classic settings':'Gameplay preset')+' + '+info[extra][1];presets.append(entry);
}
function refresh(){
 const signature = key(selected);
 if (signature !== lastSelection) {
  $('buildStatus').textContent = '';
  lastSelection = signature;
 }
 $('trainerQuote').hidden = !selected.has(STARTING_THRUSTS_ID);
 refreshSuggested();
 $('cards').replaceChildren();
 for(const [id,[cat,name,help]] of Object.entries(info)){
  if(filter!=='All'&&filter!==cat)continue;
  if([...defaultReversals.values()].includes(+id))continue;
  const label=document.createElement('label');label.className='card';
  const input=document.createElement('input');input.type='checkbox';input.value=id;input.checked=selected.has(+id);
  input.addEventListener('change',()=>{if(input.checked)selected.add(+id);else selected.delete(+id);$('preset').value=selected.size?'':'suggested';refresh();$('cards').querySelector('input[value="'+id+'"]')?.focus({preventScroll:true})});
  const copy=document.createElement('span'), title=document.createElement('strong'), desc=document.createElement('small');
  title.textContent=name;desc.textContent=help;copy.append(title,desc); label.append(input,copy);$('cards').append(label);
 }
 const secondary=$('unavailable');
 secondary.replaceChildren();
 for(const [id,cat,name,help] of unavailable){
  if(filter!=='All'&&filter!==cat)continue;
  const row=document.createElement('div');row.className='card unavailable';
  const text=document.createElement('span'),title=document.createElement('strong'),desc=document.createElement('small');
  title.textContent=name;desc.textContent=help;text.append(title,desc);row.append(text);secondary.append(row);
 }
 $('unavailablePanel').hidden=!secondary.children.length;
 $('selection').replaceChildren();
 if(!selected.size){const p=document.createElement('p');p.className='empty';p.textContent='Suggested Redux preset';$('selection').append(p)}
 else {const list=document.createElement('ul');for(const id of selected){const li=document.createElement('li'), name=document.createElement('span'), del=document.createElement('button');name.textContent=info[id][1];del.type='button';del.textContent='×';del.setAttribute('aria-label','Remove '+info[id][1]);del.addEventListener('click',()=>{selected.delete(id);$('preset').value=selected.size?'':'suggested';refresh();$('preset').focus({preventScroll:true})});li.append(name,del);list.append(li)}$('selection').append(list)}
 const variant=current();
 if (variant === undefined) {
  $('variantStatus').textContent = conflicts() || 'This combination isn’t available. Choose a preset, a single option, or a supported variation.';
 } else if (!reduxBase) {
  $('variantStatus').textContent = 'Choose your unpatched Zelda II SNES ROM to continue.';
 } else {
  $('variantStatus').textContent = selected.size ? 'Your selected options are ready to download.' : 'Suggested Redux is ready to download.';
 }
 $('build').disabled = busy || !reduxBase || variant === undefined;
 $('build').textContent=selected.size?'Download custom ROM (.sfc)':'Download Suggested Redux .sfc';
}
for(const name of ['All','Gameplay','Progression','Audio','Visual']){
 const b=document.createElement('button');b.type='button';b.textContent=name;b.setAttribute('aria-pressed',name==='All');
 b.addEventListener('click',()=>{filter=name;for(const item of $('tabs').children)item.setAttribute('aria-pressed',item===b);refresh()});$('tabs').append(b);
}
$('preset').addEventListener('change',e=>{if(e.target.value==='suggested'){resetSuggested();return}if(!e.target.value)return;const v=CATALOG.variants.find(x=>x.slug===e.target.value);selected.clear();for(const id of v.ids)selected.add(id);refresh()});
async function verifyFile(file) {
 const token = ++inputToken;
 reduxBase = null;
 $('buildStatus').textContent = '';
 $('fileStatus').textContent = file ? 'Checking the ROM…' : 'No file selected';
 refresh();
 if (!file) return;
 try {
  const source = await readUnpatchedPort(file);
  if (token !== inputToken) return;
  $('fileStatus').textContent = 'Revision G verified. Applying Suggested Redux…';
  const patched = await applyVerifiedPatch(source, REVISION_G.suggestedPatch);
  if (token !== inputToken) return;
  reduxBase = patched;
  $('fileStatus').textContent = 'Unpatched Revision G verified · ' + file.name;
 } catch (error) {
  if (token !== inputToken) return;
  $('fileStatus').textContent = error.message || String(error);
 }
 refresh();
}
$('file').addEventListener('change', event => {
 const input = event.currentTarget;
 const file = input.files[0];
 input.value = '';
 verifyFile(file);
});
for(const evt of ['dragenter','dragover'])$('drop').addEventListener(evt,e=>{e.preventDefault();$('drop').classList.add('drag')});
for(const evt of ['dragleave','drop'])$('drop').addEventListener(evt,e=>{e.preventDefault();$('drop').classList.remove('drag')});
$('drop').addEventListener('drop',e=>verifyFile(e.dataTransfer.files[0]));
$('build').addEventListener('click', async () => {
 const source = reduxBase;
 const variant = current();
 if (!source || busy || variant === undefined) return;
 const withThrusts = selected.has(STARTING_THRUSTS_ID);
 const token = inputToken;
 const signature = key(selected);
 const stillSelected = () => token === inputToken && signature === key(selected);
 busy = true;
 refresh();
 $('buildStatus').textContent = 'Preparing your download…';
 try {
  const output = await buildSelection(source, variant, withThrusts);
  if (!stillSelected()) return;
  const link = document.createElement('a');
  const suffix = variant ? '_' + (variant.slug || 'Custom') : '';
  link.download = 'Zelda_II_Redux_SNES' + suffix + (withThrusts ? '_Both_Thrusts' : '') + '.sfc';
  const url = URL.createObjectURL(new Blob([output], {type: 'application/octet-stream'}));
  link.href = url;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  $('buildStatus').textContent = 'Verified game file. Download started.';
 } catch (error) {
  if (stillSelected()) $('buildStatus').textContent = error.message || String(error);
 } finally {
  busy = false;
  refresh();
 }
});
refresh();
