#!/usr/bin/env python3
"""Reproduce the isolated normal P1 palette delta from a user-supplied exact base.
Adapted from the project's palette_consistency/build_p1.py; no game data bundled.
"""
import argparse
import hashlib
from pathlib import Path

BASE_SHA256 = '35b826af2e33093346b7e6cf25684f37038b3495ff2055a37547d5376668e951'
TARGET_SHA256 = '6397aca12cf7ba16fe6c173e977082962b84ae7e217124cf21c057655a115f72'


def sites():
    result = [0x21a849]
    result += [(bank << 16) + addr for bank in range(0x22, 0x27)
               for addr in (0x809e, 0x80ae, 0x80be, 0x80ce)]
    result += [0x2480de]
    result += [(bank << 16) + addr for bank in range(0x21, 0x29)
               for addr in (0xc453, 0xc46b)]
    if len(set(result)) != 38:
        raise ValueError('Invalid palette site set')
    return result


def build(raw):
    if hashlib.sha256(raw).hexdigest() != BASE_SHA256:
        raise ValueError('Wrong input: exact already-modified SNES-port base required')
    output = bytearray(raw)
    for offset in sites():
        # Change only the two intended color indices; retain the other base bytes.
        output[offset + 1] = 7
        output[offset + 2] = 55
    output[0xffdc:0xffe0] = (65535).to_bytes(2, 'little') + bytes(2)
    checksum = sum(output) & 65535
    output[0xffdc:0xffe0] = (checksum ^ 65535).to_bytes(2, 'little') + checksum.to_bytes(2, 'little')
    if sum(a != b for a, b in zip(raw, output)) != 80:
        raise ValueError('Unexpected changed-byte count')
    if hashlib.sha256(output).hexdigest() != TARGET_SHA256:
        raise ValueError('Target hash mismatch')
    return bytes(output)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('base', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    target = build(args.base.read_bytes())
    with args.output.open('xb') as stream:
        stream.write(target)
    print(TARGET_SHA256)
