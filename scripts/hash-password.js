#!/usr/bin/env node

/**
 * Generate PBKDF2 password hash for ADMIN_PASSWORD_HASH env var
 * Usage: node scripts/hash-password.js <password>
 * 
 * Uses Web Crypto API (Node.js 15+ required)
 */

const crypto = require('crypto').webcrypto;

const PBKDF2_ITERATIONS = 100000;
const HASH_LENGTH = 32;
const SALT_LENGTH = 16;

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    HASH_LENGTH * 8
  );

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

  return `pbkdf2:${PBKDF2_ITERATIONS}:${saltHex}:${hashHex}`;
}

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.js <password>');
  process.exit(1);
}

hashPassword(password).then(hash => {
  console.log('\nADD THIS TO YOUR ENVIRONMENT VARIABLES:\n');
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log('\n');
}).catch(err => {
  console.error('Error generating hash:', err);
  process.exit(1);
});
