# Source preservation scope (2026-11-18)

This repository preserves a curated, recoverable subset of project-authored patch source. It is not a complete source tree for Zelda II, its SNES port, or every historical Redux change.

## Reproducible normal P1

`source/build_p1.py` preserves the current normal P1 transformation in portable form, adapted from the project's original `palette_consistency/build_p1.py`. It removes workspace-specific paths, the unrelated experimental R7 input, and embedded old palette tuples; it keeps the same 38 offsets and two intended color-index replacements per site. It verifies the exact input, changed-byte count and target hash, recomputes the SNES checksum, and refuses to overwrite an output.

Python 3, no third-party packages:

```
python source/build_p1.py YOUR_REQUIRED_BASE.sfc local_p1.sfc
python tools/bps_delta.py YOUR_REQUIRED_BASE.sfc local_p1.sfc local_p1.bps
python tools/verify_bps.py YOUR_REQUIRED_BASE.sfc local_p1.bps
```

Required base: the already-modified `Zelda2_Redux_Main_Alignment_NPC_TEST.sfc`, SHA-256 `35b826af2e33093346b7e6cf25684f37038b3495ff2055a37547d5376668e951`. This is NOT a vanilla NES ROM or an arbitrary clean SNES-port build. Supply your own lawful copy; the repository does not include it.

Verified locally: the portable builder reproduced the normal P1 target byte-for-byte, SHA-256 `6397aca12cf7ba16fe6c173e977082962b84ae7e217124cf21c057655a115f72`. Regenerating the BPS reproduced the existing 218-byte patch byte-for-byte, SHA-256 `21ad15984e9f47ee644fa2e82e552b2a0c3136220eb9f61b4f37602f4a38ba72`.

## Audit and exclusions

The published builder contains control flow, numeric patch locations, color-index choices and hashes, not bundled ROM bytes, graphics, music, dialogue or copied disassembly. The existing generic BPS tools contain no game data. The curated text files were inspected for credentials, private machine paths and embedded game payloads.

Not uploaded:

- ROM/SFC files, SRAM, save states, runtime memory or audio dumps, screenshots and extracted game graphics.
- Historical upstream source trees and checkpoint archives, even archives labeled ROM-free: these require separate provenance and payload review.
- Historical native-spacing and renderer experiments containing copied original instruction sequences or uncertain source provenance.
- Experimental R7 timing/rendering changes, and the user-excluded upstream lag-reduction change.
- Historical fun-dialogue scripts containing quoted third-party dialogue. Any separately reviewed personal build source must document its own scope and base.

## Remaining recovery gaps

This subset can reproduce the palette delta on the exact known Redux SNES-port base. It cannot reconstruct that already-modified base from a clean SNES port. Full historical Redux reconstruction and source provenance remain unresolved. Hardware validation and remaining late-game checks are not implied by successful hash reproduction. Additional verified build variants may be stored in separate source files and manifests without changing these normal P1 claims.
