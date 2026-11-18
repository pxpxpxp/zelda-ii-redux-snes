# Original Dev08 audit utilities

These three Python 3 scripts are preserved **byte-for-byte** from the retained Development 08 checkpoint. They are historical project-authored tooling, not game source, and do not replace the active tools or normal P1 builder. No ROM, patch payload, graphics, dialogue, upstream code or runtime output is included here.

## Inventory and SHA-256

| Preserved path | SHA-256 |
|---|---|
| `work/apply_bps.py` | `50c7e15a6725da3825ebd5033f10f73eb88f581ce13bb694546b8ea0ebb7149e` |
| `checkpoint/mapping_audit.py` | `bc92367629d418d08341bdd48d5fa4361e03de929c2024da0cb7bd8bd36313ed` |
| `enemy_balance_validation/inspect_canonical_bps.py` | `552dfbcb35cb48c938231c4a511913033dffbb836969e11e206b5e3a16d7d404` |

The earlier `Zelda2_SNES_Redux_Port_Checkpoint_01.zip` (Library version 6, 190,588 bytes; SHA-256 `f052c628a6fad5349996fe0a0adc8b1687314a4f2b179c67ae47e77cae3c8ad6`) was independently recovered. All its 53 files, including 43 Python scripts, already existed byte-for-byte inside Dev08's checkpoint subtree. It supplied no missing source. Only the selected utilities above are published, not that archive.

## All-four-actions BPS CLI

`work/apply_bps.py` accepts three arguments:

```
python source/archive/dev08/work/apply_bps.py PATCH.bps SOURCE.bin NEW_OUTPUT.bin
```

Supply your own lawful matching source and trusted BPS patch. The source suffix is arbitrary despite the old usage string. The script supports SourceRead, TargetRead, SourceCopy and TargetCopy, checks source size and source/target/patch CRCs, then writes output. This is materially broader than the active `tools/verify_bps.py`, which intentionally accepts only the two actions emitted by this repository's delta generator.

Preservation checks: a wholly synthetic patch exercising all four actions reproduced its expected output; a same-size incorrect source was rejected before output creation. These are focused tests, not a malformed-input security audit.

**Historical limitations:** assertions are essential, so never use Python `-O`. It overwrites an existing output, has no input/output collision guard, and is not hardened against malicious patches or excessive allocations. Use a separate scratch directory, trusted inputs and a new output filename. The active tools are unchanged.

## Mapping audit

`checkpoint/mapping_audit.py` compares changed NES PRG bytes with their mapped SNES locations and prints counts for original-matching, Redux-matching and mixed bytes. It also prints a CHR difference count. Useful for reproducing the original port-mapping analysis, **not a feature-completion measure**.

Run from an isolated working directory containing these exact relative inputs:
- `nesbase/Zelda II - The Adventure of Link (USA).nes`: original iNES source.
- `redux-nes.nes`: corresponding patched NES output.
- `zelda2-revg.sfc`: headerless SNES revision G input.

Expected historical input identities:
- Original NES SHA-256: `ad8c0fbcf092bf84b48e69fd3964eea4ed91bfe62abc352943d537979782680c`
- Patched NES SHA-256: `42d5d418a2b88480e00f3df4c7f177f2256ffbee17915d45b42d28490ea61594`
- SNES revision G SHA-256: `afc824e578ec74d55d124a2e4f6e558f9d70e6f9a96ce35c3489af33f07cd6ee`

The historical script assumes a 16-byte iNES header and fixed bank layout; it does not itself validate these hashes. Verify inputs separately. It prints aggregate counts only.

## BPS source/literal ancestry inspection

`enemy_balance_validation/inspect_canonical_bps.py` tracks whether selected output bytes originate from source locations or patch literals, including propagation through copy operations. This preserves the method used to inspect specific enemy-change provenance without embedding any of those bytes in source.

Run from an isolated working directory containing:
- `zelda2_recovery/upstream/patches/Zelda2_Redux.bps`: historical upstream patch, SHA-256 `ad484c14c5af47d55151efe8b8fbd5562bf497c6086aefaae56e7baadae1354a`.
- An existing writable `zelda2_recovery/enemy_balance_validation/` output directory.

It writes `canonical_bps_flags.json` there and prints the same selected numeric mappings. No source ROM is needed, and no input patch is bundled. The script checks patch CRC but does not enforce the expected SHA-256 or validate musical/gameplay behavior. Its outputs may contain literal values from the supplied patch: keep generated reports local until separately reviewed.

## Scope

Only source preservation and the focused synthetic BPS tests are claimed here. The mapping and ancestry programs were inspected but not newly re-run against copyrighted inputs for this archival update. No fresh game-feature or hardware qualification follows from this commit. Reconstructing the complete normal Redux base remains a separate unresolved task.
