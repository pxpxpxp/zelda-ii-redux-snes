'use strict';

async function sha(bytes) {
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
}

async function readUnpatchedPort(file) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Open the patch builder over HTTPS so it can verify your game file.');
  }

  const headerLength = file.size === REVISION_G.size + 512 ? 512 : 0;
  if (file.size !== REVISION_G.size + headerLength) {
    throw new Error('Choose the 4 MiB Revision G SNES ROM (.sfc or .smc).');
  }
  const rom = new Uint8Array(await file.slice(headerLength).arrayBuffer());
  const hash = await sha(rom);
  if (hash === REVISION_G.sha256) return rom;

  const isRedux = hash === CATALOG.base_sha256 || hash === STARTING_THRUSTS.target_sha256 ||
    Object.values(STARTING_THRUSTS.combinedTargets).includes(hash) ||
    CATALOG.variants.some(variant => variant.target_sha256 === hash) ||
    Object.values(SUGGESTED_COMBINATIONS).some(variant => variant.target_sha256 === hash);
  if (isRedux) {
    throw new Error('This file already has Redux applied. Choose your unpatched Zelda II SNES ROM.');
  }
  throw new Error('This file doesn’t match the unpatched Zelda II SNES port, Revision G. Check the file details below.');
}

const crc32=(()=>{
 const table=Uint32Array.from({length:256},(_,i)=>{for(let bit=0;bit<8;bit++)i=(i>>>1)^((i&1)?0xedb88320:0);return i});
 return bytes=>{let value=0xffffffff;for(let i=0;i<bytes.length;i++)value=(value>>>8)^table[(value^bytes[i])&255];return (value^0xffffffff)>>>0};
})();
function applyBps(source, patch){
 if(patch.length<16||String.fromCharCode(...patch.subarray(0,4))!=='BPS1')throw Error('Invalid BPS patch.');
 const view=new DataView(patch.buffer,patch.byteOffset,patch.byteLength), tail=patch.length-12;
 if(crc32(patch.subarray(0,patch.length-4))!==view.getUint32(tail+8,true))throw Error('Patch CRC mismatch.');
 if(crc32(source)!==view.getUint32(tail,true))throw Error('Source CRC mismatch.');
 let ptr=4,pos=0,srel=0,trel=0;
 const num=()=>{let value=0,shift=1;for(let i=0;i<7&&ptr<tail;i++){const b=patch[ptr++];value+=(b&127)*shift;if(b&128)return value;shift*=128;value+=shift}throw Error('Invalid BPS integer.')};
 const signed=()=>{const x=num();return (x%2?-1:1)*Math.floor(x/2)};
 if(num()!==source.length)throw Error('Source size mismatch.');
 const size=num(), meta=num();ptr+=meta;if(size>16*1024*1024||ptr>tail)throw Error('Invalid BPS size.');
 const output=new Uint8Array(size);
 while(pos<size){
  const word=num(), len=Math.floor(word/4)+1;
  if(pos+len>size)throw Error('BPS write out of range.');
  switch(word%4){
    case 0: if(pos+len>source.length)throw Error('BPS source read out of range.');output.set(source.subarray(pos,pos+len),pos);pos+=len;break;
    case 1: if(ptr+len>tail)throw Error('Truncated BPS literals.');output.set(patch.subarray(ptr,ptr+len),pos);ptr+=len;pos+=len;break;
    case 2: srel+=signed();if(srel<0||srel+len>source.length)throw Error('BPS source copy out of range.');output.set(source.subarray(srel,srel+len),pos);srel+=len;pos+=len;break;
    case 3: trel+=signed();if(trel<0||trel>=pos)throw Error('BPS target copy out of range.');for(let i=0;i<len;i++)output[pos++]=output[trel++];break;
  }
 }
 if(ptr!==tail||crc32(output)!==view.getUint32(tail+4,true))throw Error('Target CRC mismatch.');
 return output;
}
function combinePatches(source, verifiedOutputs){
 const result=source.slice(), seen=new Set();
 for(const output of verifiedOutputs){
  if(output.length!==source.length)throw Error('Unexpected patch output size.');
  for(let i=0;i<source.length;i++){
   if(i>=0xffdc&&i<=0xffdf||output[i]===source[i])continue;
   if(seen.has(i))throw Error('These patches overlap.');
   seen.add(i);result[i]=output[i];
  }
 }
 let checksum=0x1fe;
 for(let i=0;i<result.length;i++)if(i<0xffdc||i>0xffdf)checksum=(checksum+result[i])&0xffff;
 const view=new DataView(result.buffer);
 view.setUint16(0xffdc,checksum^0xffff,true);view.setUint16(0xffde,checksum,true);
 return result;
}

async function applyVerifiedPatch(source, patchInfo) {
  const response = await fetch('patches/' + encodeURIComponent(patchInfo.file));
  if (!response.ok) throw new Error('The patch could not be loaded. Please try again.');
  const patch = new Uint8Array(await response.arrayBuffer());
  if (await sha(patch) !== patchInfo.patch_sha256) throw new Error('The patch failed its integrity check.');
  const output = applyBps(source, patch);
  if (await sha(output) !== patchInfo.target_sha256) throw new Error('The patched game failed its integrity check.');
  return output;
}

async function buildVariant(reduxBase, variant) {
  if (!variant) return reduxBase;
  if (!variant.combo) return applyVerifiedPatch(reduxBase, variant);

  const reversals = await Promise.all(variant.combo.map(id => {
    const reversal = CATALOG.variants.find(entry => entry.ids.length === 1 && entry.ids[0] === id);
    return applyVerifiedPatch(reduxBase, reversal);
  }));
  const output = combinePatches(reduxBase, reversals);
  if (await sha(output) !== variant.target_sha256) throw new Error('The combined patches failed their integrity check.');
  return output;
}

async function buildSelection(reduxBase, variant, withThrusts = false) {
  if (!withThrusts) return buildVariant(reduxBase, variant);
  if (!variant) return applyVerifiedPatch(reduxBase, STARTING_THRUSTS);

  const expected = STARTING_THRUSTS.combinedTargets[variant.target_sha256];
  if (!expected) throw new Error('This build has not been verified with both thrusts.');
  const outputs = await Promise.all([
    buildVariant(reduxBase, variant),
    applyVerifiedPatch(reduxBase, STARTING_THRUSTS)
  ]);
  const output = combinePatches(reduxBase, outputs);
  if (await sha(output) !== expected) throw new Error('The combined patches failed their integrity check.');
  return output;
}
