from pathlib import Path
import struct,zlib
import sys
if len(sys.argv)!=4:raise SystemExit('usage: apply_bps.py patch.bps source.sfc output.sfc')
p=Path(sys.argv[1]).read_bytes(); src=Path(sys.argv[2]).read_bytes(); assert p[:4]==b'BPS1'; pos=4
def read():
 global pos
 v=0; shift=1
 while 1:
  x=p[pos]; pos+=1; v+=(x&127)*shift
  if x&128: return v
  shift <<=7; v+=shift
n=read(); m=read(); meta=read(); pos+=meta
print('source',n,'target',m,'metadata',meta); assert n==len(src)
out=bytearray(); sr=tr=0
while len(out)<m:
 val=read(); action=val&3; count=(val>>2)+1
 if action==0: out.extend(src[len(out):len(out)+count])
 elif action==1: out.extend(p[pos:pos+count]); pos+=count
 elif action==2:
  x=read(); sr+=(-(x>>1) if x&1 else x>>1); out.extend(src[sr:sr+count]); sr+=count
 else:
  x=read(); tr+=(-(x>>1) if x&1 else x>>1)
  for _ in range(count): out.append(out[tr]); tr+=1
assert len(out)==m and pos==len(p)-12
assert zlib.crc32(src)==struct.unpack('<I',p[-12:-8])[0]
assert zlib.crc32(out)==struct.unpack('<I',p[-8:-4])[0]
assert zlib.crc32(p[:-4])==struct.unpack('<I',p[-4:])[0]
Path(sys.argv[3]).write_bytes(out); print('BPS source, target, and patch CRCs pass')
