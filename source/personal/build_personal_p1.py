"""Personal opt-in only: new files begin with both thrusts; owned trainers acknowledge.
Never modifies the input or existing SRAM. Requires repaired initial-presence table.
"""
from pathlib import Path
import sys,hashlib,json
src=Path(sys.argv[1]);out=Path(sys.argv[2]);assert src.resolve()!=out.resolve()
b=src.read_bytes();o=bytearray(b)
assert hashlib.sha256(b).hexdigest()=='6397aca12cf7ba16fe6c173e977082962b84ae7e217124cf21c057655a115f72', 'Exact normal P1 required'
assert not out.exists(), 'Output already exists'
assert b[0x26bb02]==0
assert b[0x24be00:0x24be80]==bytes([255])*128
# Source-confirmed native new-save beginning-values byte for0796.
o[0x26bb02]=0x14
# Both already-known branches jump directly to private message setup.
# Unknown-tech branches and grant logic remain unchanged.
for a in [0x24b4c6,0x24b4de]:
 assert b[a:a+5]==bytes.fromhex('e605ee8c04');o[a:a+5]=bytes.fromhex('4c00be eaea')
code=bytes.fromhex('a9018d8c04 a9208d6905 a9be8d6a05 4c14b6')
o[0x24be00:0x24be00+len(code)]=code
lines=['IT LOOKS','LIKE YOU\'VE','ALREADY','LEARNED','THESE','TECHNIQUES']
assert max(map(len,lines))<=11
enc={chr(65+i):0xda+i for i in range(26)};enc.update({' ':0xf4,"'":0x35})
data=b'\xfd'.join(bytes(enc[c] for c in l) for l in lines)+b'\xff'
assert len(data)<=96
o[0x24be20:0x24be20+len(data)]=data
# Header checksum is the only non-option change.
o[0xffdc:0xffe0]=bytes.fromhex('ffff0000');s=sum(o)&65535
o[0xffdc:0xffde]=(s^65535).to_bytes(2,'little');o[0xffde:0xffe0]=s.to_bytes(2,'little');assert sum(o)&65535==s
with out.open('xb') as f: f.write(o)
m={'base_sha256':hashlib.sha256(b).hexdigest(),'sha256':hashlib.sha256(o).hexdigest(),'lines':lines,'new_save_flags':'0796=14','existing_saves':'not modified; existing saves retain earned flags','status':'UNQUALIFIED PERSONAL TEST','changed_bytes':sum(a!=c for a,c in zip(b,o))}
out.with_suffix('.json').write_text(json.dumps(m,indent=2));print(json.dumps(m,indent=2))
