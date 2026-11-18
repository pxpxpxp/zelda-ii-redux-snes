#!/usr/bin/env python3
"""Verify source/read BPS deltas and print the reconstructed target hash."""
import hashlib, struct, sys, zlib
from pathlib import Path

def apply(source, patch):
    assert patch[:4] == b'BPS1', 'Bad signature'
    assert zlib.crc32(patch[:-4]) == struct.unpack('<I', patch[-4:])[0], 'Patch CRC'
    source_crc, target_crc = struct.unpack('<II', patch[-12:-4])
    assert zlib.crc32(source) == source_crc, 'Wrong source CRC'
    pos = 4
    def read():
        nonlocal pos
        value, shift = 0, 1
        while True:
            byte = patch[pos]; pos += 1
            value += (byte & 127) * shift
            if byte & 128:
                return value
            shift <<= 7
            value += shift
    assert read() == len(source), 'Wrong source length'
    target_size = read()
    metadata_size = read(); pos += metadata_size
    output = bytearray()
    while len(output) < target_size:
        action = read(); size = (action >> 2) + 1
        if action & 3 == 0:
            output += source[len(output):len(output) + size]
        elif action & 3 == 1:
            output += patch[pos:pos + size]; pos += size
        else:
            raise ValueError('Only source/read deltas supported by this verifier')
    assert pos == len(patch) - 12 and len(output) == target_size
    assert zlib.crc32(output) == target_crc, 'Target CRC'
    return output

if __name__ == '__main__':
    source, patch = (Path(p).read_bytes() for p in sys.argv[1:3])
    output = apply(source, patch)
    print(hashlib.sha256(output).hexdigest())
