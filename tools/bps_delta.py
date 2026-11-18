#!/usr/bin/env python3
"""Create a BPS delta from two user-supplied files. No bundled game data."""
import argparse, hashlib, struct, zlib
from pathlib import Path

def number(n):
    out = bytearray()
    while True:
        value = n & 127
        n >>= 7
        if not n:
            out.append(value | 128)
            return out
        out.append(value)
        n -= 1

def make(source, target):
    patch = bytearray(b'BPS1') + number(len(source)) + number(len(target)) + number(0)
    pos = 0
    while pos < len(target):
        same = pos < len(source) and source[pos] == target[pos]
        end = pos + 1
        while end < len(target) and (end < len(source) and source[end] == target[end]) == same:
            end += 1
        patch += number(((end - pos - 1) << 2) | (0 if same else 1))
        if not same:
            patch += target[pos:end]
        pos = end
    patch += struct.pack('<II', zlib.crc32(source), zlib.crc32(target))
    patch += struct.pack('<I', zlib.crc32(patch))
    return patch

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('target', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    result = make(args.source.read_bytes(), args.target.read_bytes())
    with args.output.open('xb') as f:
        f.write(result)
    print(hashlib.sha256(result).hexdigest())
