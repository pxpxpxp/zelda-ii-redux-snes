from pathlib import Path
import json,zlib,struct
p=Path('zelda2_recovery/upstream/patches/Zelda2_Redux.bps').read_bytes();pos=4
assert p[:4]==b'BPS1'
def read():
 global pos
 v=0;shift=1
 while 1:
  x=p[pos];pos+=1;v+=(x&127)*shift
  if x&128:return v
  shift<<=7;v+=shift
n=read();m=read();meta=read();pos+=meta;out=[];sr=tr=0
while len(out)<m:
 val=read();action=val&3;count=(val>>2)+1
 if action==0:out.extend(('source',i) for i in range(len(out),len(out)+count))
 elif action==1:out.extend(('literal',v) for v in p[pos:pos+count]);pos+=count
 elif action==2:
  x=read();sr+=(-(x>>1) if x&1 else x>>1);out.extend(('source',i) for i in range(sr,sr+count));sr+=count
 else:
  x=read();tr+=(-(x>>1) if x&1 else x>>1)
  for _ in range(count):out.append(out[tr]);tr+=1
assert len(out)==m and pos==len(p)-12
assert zlib.crc32(p[:-4])==struct.unpack('<I',p[-4:])[0]
result={hex(o):out[o] for o in [0x15565,0x15566,0x15568,0x11557,0x1155f,0x12a57,0x12a5f]}
Path('zelda2_recovery/enemy_balance_validation/canonical_bps_flags.json').write_text(json.dumps(result,indent=2));print(result)
