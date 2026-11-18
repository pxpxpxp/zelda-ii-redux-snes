from pathlib import Path
from collections import Counter
base=Path('nesbase/Zelda II - The Adventure of Link (USA).nes').read_bytes(); redux=Path('redux-nes.nes').read_bytes(); snes=Path('zelda2-revg.sfc').read_bytes()
print('Redux base-versus-target analysis (byte counts; not feature counts)')
for bank in range(8):
 begin=16+bank*0x4000; end=begin+0x4000; dif=[j for j in range(0x4000) if base[begin+j]!=redux[begin+j]]
 copies=range(0x21,0x29) if bank==7 else [0x21+bank]
 counts=Counter()
 for j in dif:
  vals=[snes[(c<<16)+(0xc000 if bank==7 else 0x8000)+j] for c in copies]
  if all(v==base[begin+j] for v in vals): counts['all_match_original']+=1
  elif all(v==redux[begin+j] for v in vals): counts['all_match_redux']+=1
  else: counts['other_or_mixed']+=1
 print('PRG bank',bank, 'changed',len(dif),dict(counts))
begin=16+0x20000
print('CHR changed',sum(a!=b for a,b in zip(base[begin:],redux[begin:])))
