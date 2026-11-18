# Zelda II Redux SNES — preservation checkpoint

Private preservation of original patch tooling and a **palette-only P1 TEST delta**. This is **not a complete Redux source release**, and the included patch is **not a full Redux conversion from a clean game**.

## Redux feature checklist

See [the 43-item core and 35-item optional Redux checklist](REDUX_CHECKLIST.md) for what was added, historical versus current testing, intentional exclusions, and remaining release checks. Historical 41/43 targeted-test coverage is **not** a current-P1 completion percentage.

## Prerelease: P1 palette-only test

Apply `patches/Zelda2_Redux_Main_to_P1_Palette_ONLY_TEST.bps` only to the already-modified `Zelda2_Redux_Main_Alignment_NPC_TEST.sfc` build with the exact hash below. Obtain your own lawful base; none is included. A clean NES ROM or unrelated SNES port is **not** the required input.

- Required input SHA-256: `35b826af2e33093346b7e6cf25684f37038b3495ff2055a37547d5376668e951`
- Output SHA-256: `6397aca12cf7ba16fe6c173e977082962b84ae7e217124cf21c057655a115f72`
- Patch SHA-256: `21ad15984e9f47ee644fa2e82e552b2a0c3136220eb9f61b4f37602f4a38ba72`

P1 changes 76 Link static-palette bytes at 38 sites, plus four checksum bytes. No executable, timing, renderer, NPC, scenery, or flash-control changes. Upstream lag reduction is deliberately **not added**.

## Validation and limits

The patch was applied back to its exact required base and reproduced the target SHA-256. Source, target, and patch CRCs were verified. Paired emulator testing through Palace 5, including Gooma, key/gate/crystal, native Save and reset, found identical gameplay/RNG/OAM/audio state across 54,180 frames; captured image differences were restricted to the intended Link/avatar palette. This is not full-game or MiSTer/PVM hardware qualification. Palace 6/endgame and hardware checks remain outstanding. R7 timing/rendering experiments are excluded.

## Source preservation scope

`tools/bps_delta.py` is original generic BPS creation source. `tools/verify_bps.py` independently decodes the source-read/target-read subset used here and verifies checksums. These tools contain no game ROM, art, audio, dialogue, disassembly, emulator source, or third-party code. Their presence does not reconstruct the entire historical Redux build. A verified clean-base full Redux patch and safe complete build-source provenance have not yet been established.

Usage (Python 3):

```
python tools/verify_bps.py YOUR_REQUIRED_BASE.sfc patches/Zelda2_Redux_Main_to_P1_Palette_ONLY_TEST.bps
python tools/bps_delta.py YOUR_REQUIRED_BASE.sfc YOUR_P1_TARGET.sfc output.bps
```

Use a BPS-capable patcher to save a playable output. Keep your original file and saves backed up. Never overwrite the only copy of your base.

No ROMs, game assets, screenshots, SRAM, save states, memory dumps, copyrighted upstream source, or secrets are distributed here.
