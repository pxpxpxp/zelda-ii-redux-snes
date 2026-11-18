# Optional starting-thrust P1 source

This separate builder adds starting Upthrust and Downthrust to new save files, plus the owner's custom trainer acknowledgment. Existing SRAM is not modified; existing saves retain their learned flags. It does not alter normal P1.

Run with Python 3 (without `-O`, because input guards use assertions):

```
python source/personal/build_personal_p1.py YOUR_NORMAL_P1.sfc local_personal_p1.sfc
```

The only accepted base is normal P1 SHA-256 `6397aca12cf7ba16fe6c173e977082962b84ae7e217124cf21c057655a115f72`. Keep the base and saves backed up. The output filename must not already exist; the adjacent JSON manifest is generated beside it. No ROM, SRAM or game assets are included.

The source contains original optional patch code, numeric offsets/format constants, a five-byte compatibility guard, and the owner's trainer acknowledgment. It does not embed game graphics, music or existing game dialogue. Byte reproduction is distinct from runtime/hardware qualification; refer to the corresponding test release for verified coverage and remaining limitations.
