# Redux implementation and validation checklist

Updated 2026-11-19. Scope: **normal SNES P1 TEST**, excluding the R7 renderer experiment and future MSU patch.

## Read this first

This tracks **whether a feature was added** separately from **how it was tested**. An added feature is not automatically fully validated.

- Historical Dev08 checklist: **41 of 43 core items passed a targeted emulator test (95.3%)**. Those tests often used controlled starting states. This is a historical coverage count, not a current-P1 completion percentage.
- Current P1 enemy source audit: **47 of 47 direct enemy patch blocks match**. This establishes code/data presence, not every enemy's runtime behavior.
- Current fully validated Redux percentage: **not established**. Do not present 95% as release readiness.
- **35 optional changes are outside the normal port's core denominator.** Exclusion does not mean unfinished core work.
- The P1 delta itself only repairs Link's static palettes. Most features below belong to its already-modified required base, not to the downloadable P1 delta.

### Status key

**Added (historical)** = retained Dev08 evidence says implemented and targeted-tested; current P1 has not received a fresh exhaustive row-by-row audit.  
**Present (current source)** = independently checked in current P1; runtime qualification may remain.  
**Partial / unverified** = some implementation or test evidence exists, but the complete claim is not proven.  
**Customized** = intentionally differs from upstream; do not treat it as literal upstream parity.  
**Excluded** = not included in normal scope; no implementation claim.

## Exact build identity

- Required normal base SHA-256: `35b826af2e33093346b7e6cf25684f37038b3495ff2055a37547d5376668e951`
- Normal P1 SHA-256: `6397aca12cf7ba16fe6c173e977082962b84ae7e217124cf21c057655a115f72`
- P1-only change: 76 palette bytes at 38 static Link sites, plus four checksum bytes.
- No lag-reduction, executable, timing, renderer, NPC or background changes in this delta.

## Core Redux changes (43)

The historical-test column preserves the old checklist without pretending it certifies today's build. Remaining checks are deliberately explicit.

| # | Change | Added? | Historical targeted test | Current evidence / remaining validation |
|---|---|---|---|---|
| 1 | Hearts with quarter-heart increments | Added (historical) | Passed | Controlled health values tested; exhaustive current HUD states remain. |
| 2 | Redesigned HUD | Added (historical) | Passed | HUD, pause and forced level-up sampled; full layout edge cases remain. |
| 3 | Copy and erase save files | Added (historical) | Passed | Copy/erase/reset sequence tested; more save combinations and hardware remain. |
| 4 | Manual save using pause + Up+A | Added (historical) | Passed | Current natural progression repeatedly saves and resets successfully; all contexts remain. |
| 5 | Manual saves do not add deaths | Added (historical) | Passed | Historical comparison with forced Game Over; full current counter audit remains. |
| 6 | Revised spell and level-up panes | Added (historical) | Passed | Controlled populated panes tested; every item/level state remains. |
| 7 | Display at most nine lives without capping internal lives | Added (historical) | Passed | Boundary and synthetic counts tested; natural long-play remains. |
| 8 | Font and layout adjustments | Added (historical) | Passed | Historical full dialogue render set and UI samples; all natural contexts and PVM review remain. |
| 9 | Slash character in name entry | Added (historical) | Passed | Rendered and entered in a fresh name; current regression not separately repeated. |
| 10 | Name cursor no longer covers box border | Added (historical) | Passed | 44 directional samples; exhaustive timing remains. |
| 11 | Up/Down navigation in file and erase menus | Added (historical) | Passed | Wrap and populated-slot skipping tested. |
| 12 | Game Over restart at current palace | Added (historical) | Passed | Seven lookup entries tested; all natural restart cases remain. |
| 13 | Shield tunic blue at Life 1–4, red at 5–8 | Added (historical) | Passed | Levels 1 and 5 tested; every level/context remains. |
| 14 | Remove enemy experience theft | Added (historical) | Passed | Both shared drain paths tested; every enemy encounter remains. |
| 15 | Bubble health/XP and non-respawn changes | Customized | Passed | Historical targeted Type A/B and Giant tests; three additional Great Palace non-respawn flags went beyond upstream. All-room respawn coverage remains. |
| 16 | Reduced spell costs | Added (historical) | Passed | All 64 cost combinations tested historically; natural late-spell acquisition now also exercised. |
| 17 | Cancel Fairy using A | Present (current source) | Passed | Current relocated helper verified; requires newly pressed A alone. Natural exploratory cancellation observed; dedicated fresh per-frame assertion remains. |
| 18 | More frequent item drops | Added (historical) | Passed | Seeded weak/strong counters and actual kills tested; natural distribution remains. |
| 19 | Enemy experience and attribute rebalance | Present (current source) | Open | 47/47 direct upstream enemy patch blocks match P1; exhaustive enemy-by-enemy runtime coverage still open. |
| 20 | Faster/longer sword beam and faster fireball | Added (historical) | Passed | Controlled speed/range comparison; full combat coverage remains. |
| 21 | Recast selected spell across screen changes | Added (historical) | Passed | Shield tested across an encounter transition; every spell remains. |
| 22 | Overworld PAUSE label | Added (historical) | Passed | Pause/resume/save tested; all uses of replaced graphics tile remain. |
| 23 | Permanent starting-life increase from Link Dolls | Added (historical) | Passed | Controlled pickup survived Continue/save/reset; natural pickup locations remain. |
| 24 | Revised horizontal sword collision | Added (historical) | Passed | Outer and inner collision boundaries tested; comprehensive combat remains. |
| 25 | Revised title and scrolling story | Added (historical) | Passed | Two title loops sampled; earlier text/scenery overlap issue requires current-context review. |
| 26 | Six-line dialogue boxes and repointed messages | Added (historical) | Passed | All 98 message records/renderings checked in controlled state; natural routing/pacing remains. |
| 27 | Revised translation | Added (historical) | Passed | All 98 streams matched retained source; every natural NPC/quest context remains. |
| 28 | Temple terminology | Added (historical) | Passed | Revised dialogue/story records audited; no full current playthrough certification. |
| 29 | Restored Erdrick reference | Added (historical) | Passed | Record and rendered message verified; natural sign interaction remains. |
| 30 | Revised Link sprite | Added (historical); current palette repair added | Passed | Sprite conversion historically matched; P1 additionally repairs static palette consistency. Exhaustive animation/ending/hardware remain. |
| 31 | Animated overworld tiles | Added (historical) | Passed | Four source-matched phases and transition tests; user also reported animations restored. Alternate/FDS mode excluded from that test. |
| 32 | Animated Path of Fire lava | Added (historical) | Passed | Four phases tested at controlled locations; full natural traversal/hardware remain. |
| 33 | Enigma and Heal spell labels | Added (historical) | Passed | Populated pause pane tested; every text context remains. |
| 34 | Reduced death and spell-learning flashes | Customized; exact upstream parity unverified | Passed on old customization | Dev08 used static death. User requested flashing restored; current normal death animation/flashing retained. Old checkbox does not prove current upstream flash parity or photosensitivity safety. |
| 35 | Correct developer credits | Added (historical) | Passed | All credit records/pointers and forced sequence checked; natural ending remains. |
| 36 | Persistent Saria Bridge after letter | Added (historical) | Passed | Guard/bridge/re-entry/save/reset tested with controlled prerequisites; complete natural quest remains. |
| 37 | Reposition north-Nabooru Basilisk | Added (historical) | Passed | Spawn and page-boundary movement tested from controlled entry. |
| 38 | Reposition Path of Fire entrance Moa | Added (historical) | Passed | Controlled entry avoided forced contact; broader scenarios remain. |
| 39 | Lower Palace 4 red Iron Knuckle spawn | Added (historical) | Passed | Correct-height walking/contact tested. |
| 40 | Old Kasuto sign message | Added (historical) | Passed | Sign opened normally after controlled entry; complete natural context remains. |
| 41 | Restore selected Palace 4/6 windows | Added (historical) | Passed | Eight rooms sampled; five exhibited changes. Full current natural review remains. |
| 42 | West NES / East FDS battle music | Partial / fidelity unverified | Open | Native regional selection/output differs, but musical fidelity is not established. Equality to prior normal-build audio only proves regression parity. Missing external MSU track is a separate future-MSU issue, not a normal SFC requirement. |
| 43 | Great Palace hole-room connecting paths | Added (historical) | Passed | Specific forward/reverse traversal tested with controlled prerequisites; all paths and natural completion remain. |

## Optional Redux changes (35, outside core scope)

**Added to normal build? No implementation or individual validation is claimed for these options.** This list records excluded options, not a promise to add them. Some reverse core changes or conflict with each other.

- [ ] 1. Automatic Fairy rescue from water/lava.
- [ ] 2. Alternate minor-item sound.
- [ ] 3. Alternate dialogue sound.
- [ ] 4. Block Fairy from passing doors.
- [ ] 5. Faster elevators.
- [ ] 6. FDS King's Tomb layout.
- [ ] 7. FDS experience requirements.
- [ ] 8. Retain experience after Game Over.
- [ ] 9. Additional sword reach.
- [ ] 10. Alternate manual level-up system.
- [ ] 11. Alternate graphics set.
- [ ] 12. FDS battle music everywhere.
- [ ] 13. NES battle music everywhere.
- [ ] 14. Original enemy attributes.
- [ ] 15. Original drop rates.
- [ ] 16. Temporary rather than permanent Link Dolls.
- [ ] 17. Original Game Over restart behavior.
- [ ] 18. Original spell costs.
- [ ] 19. Original title sword and palette.
- [ ] 20. Original title palette only.
- [ ] 21. Original title sword only.
- [ ] 22. Random battle-theme choice.
- [ ] 23. Lag reduction by limiting enemy spawning. **Intentionally excluded by user direction. No upstream lag-reduction patch is to be added.**
- [ ] 24. Remove low-health beep.
- [ ] 25. Remove dialogue sound.
- [ ] 26. Alternate Revility sprites.
- [ ] 27. Alternate title composition.
- [ ] 28. Same-screen restart retaining experience.
- [ ] 29. Running.
- [ ] 30. Same-continent restart.
- [ ] 31. Fixed palace-crystal experience rewards.
- [ ] 32. Original NES graphics.
- [ ] 33. Eighth Magic Container repair for affected older saves.
- [ ] 34. Undocumented secret option.
- [ ] 35. Red tunic starting at Life level seven.

A future MSU patch is separate from normal P1.

## Current normal-P1 release validation

Status synchronized 2026-11-19: the tested endgame route and separate restarted-campaign clean load are verified below. **This is an evidence update only; normal P1 and its patch are unchanged.** Hardware and an uninterrupted new-game-through-ending run remain unverified.

- [x] P1 patch roundtrip reproduces the exact target hash; source/target/patch CRCs checked.
- [x] Bounded static-palette repair independently reviewed.
- [x] Fresh paired emulator route through Palace 5 completion, with gameplay/RNG/OAM/audio comparisons and native save/reset.
- [x] Fresh paired late-game prerequisite routes: seventh/eighth magic containers, Spell/Magic Key and Thunder acquired and saved/reset.
- [x] Fresh paired Palace 6 entry and Magic Key door opening.
- [x] Cross acquired in a fresh paired controller-only replay and retained after native save/reset. Independently reviewed 2026-11-18 at 19:15 UTC: 41,546 frames, matching selected gameplay/RNG/OAM/audio, with no save-state restores or gameplay RAM writes.
- [x] Palace 6 completion, independently reviewed: fresh paired controller-only replay over 146,827 frames verified native Barba defeat, final crystal placement, overworld return, manual save and core reset. Selected gameplay/OAM/audio matched the prior normal build; saved-state differences were the expected palette-cache bytes. This Palace 6 milestone alone does not qualify Great Palace or the ending; see the separate endgame test below. Hardware remains unverified.
- [x] Great Palace interior entry and native death/Continue, independently verified in fresh paired emulator processes using the earned Palace 6 SRAM: 33,456 frames with matching selected gameplay/OAM/audio. Interior entry reached world 5 room 2; Continue restarted at the Great Palace entrance with six crystals retained. Screenshot differences were limited to expected palette substitutions.
- [x] Bounded Thunderbird approach/combat milestone, independently reviewed: fresh paired controller-only route from earned Palace 6 SRAM ran 78,629 frames, reached Thunderbird, activated vulnerability with native Thunder, and registered damage from 190 to 166 HP. Selected gameplay/RNG/enemy/projectile state, OAM and audio matched; all 172 screenshot pairs were identical or differed only by expected palette substitutions. The boss remained alive at this earlier bounded endpoint; victory is covered by the separate endgame test below. This earlier milestone alone is not full-game validation.
- [x] Tested Great Palace endgame route through Thunderbird victory, Dark Link, rescue, credits and final replay prompt, independently audited: 101,614-frame fresh paired controller-only replay from the previously earned Palace 6 SRAM. Selected gameplay/RNG/enemy/projectile state, OAM and audio matched. Of 187 sampled image pairs, 140 were identical and 47 differed only by expected palette substitutions. Native deaths/Continue were part of the route; this is not an uninterrupted new-game-through-ending run or exhaustive upstream-correctness certification.
- [x] Separate post-ending native Replay save and clean-process load, independently rerun on P1 in the emulator: Start at the final replay prompt produced the same saved SRAM, and a fresh process loaded the castle with Attack 4 / Magic 5 / Life 6 retained and crystals/items reset. This is a restarted campaign, not a resume inside Great Palace or preservation of the completed campaign's items. No hardware persistence claim.
- [ ] Single uninterrupted new-game-through-ending validation.
- [ ] Full current-P1 requalification of all 43 feature rows.
- [ ] Verify native regional music against intended melodies.
- [ ] Full save compatibility matrix and genuine hardware power-cycle checks.
- [ ] Current P1 MiSTer/PVM end-to-end qualification.
- [ ] Complete source provenance and clean-base full Redux patch packaging.

Checked route milestones do not mean all individual screenshots, every state variable, every optional route or hardware behavior is certified. The earlier user reports that animations returned and flicker disappeared are useful observations, not blanket approval of every later build.

## Evidence and provenance

Feature scope references [ShadowOne333's Zelda2-Redux](https://github.com/ShadowOne333/Zelda2-Redux/tree/4531c27ab404c10fc01c17b7c74bb81ae34820a8). This document is original audit prose, not a redistribution of upstream source or game content.

Retained audit records used:
- `CHECKLIST_DEV08.md`: historical 43 core / 35 optional checklist and targeted-test limitations.
- `palette_consistency/REPORT.txt` and `INDEPENDENT_REVIEW.txt`: bounded P1 palette audit.
- `redux_enemy_byte_audit.json`: current 47-block enemy source-parity audit.
- `normal_p1_validation/REPORT.txt`, `REPORT_PALACE5_COMPLETE.txt`, `REPORT_PALACE6_FRESH_PAIRED.txt`, `REPORT_GREAT_PALACE_ENTRY_FRESH_PAIRED.txt`, `REPORT_THUNDERBIRD_FRESH_PAIRED.txt`, `REVIEW_THUNDERBIRD_FRESH_PAIRED.txt`, `REPORT_ENDGAME_FRESH_PAIRED.txt`, `REVIEW_ENDGAME_FRESH_PAIRED.txt`, `REPORT_POSTENDING_FRESH_LOAD.txt` and subsequent fresh-route reports: regression/progression evidence.

These record names identify retained test evidence; they are **not links to files published in this repository**. Only documentation is added here. No ROMs, proprietary assets, dialogue dumps, screenshots, SRAM, save states, memory dumps or copyrighted upstream code accompany this checklist.
