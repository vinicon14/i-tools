#!/usr/bin/env node
/**
 * Script to generate password hash for admin user
 * Usage: node scripts/generate-admin-password.mjs your-password
 */
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-admin-password.mjs <password>');
  console.error('\nExample:');
  console.error('  node scripts/generate-admin-password.mjs MySecureP@ssw0rd');
  console.error('\nThen set these environment variables in Lovable:');
  console.error('  ADMIN_USER=admin');
  console.error('  ADMIN_PASSWORD_HASH=<generated-hash>');
  process.exit(1);
}

console.log('Generating password hash...\n');

hashPassword(password).then((hash) => {
  console.log('✓ Password hash generated successfully!\n');
  console.log('Set these environment variables in Lovable Dashboard (Cloud Agents > Secrets):');
  console.log(`\nADMIN_USER=admin`);
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log('\nOptional (for Monetag integration):');
  console.log('MONETAG_API_TOKEN=<your-monetag-api-token>');
  console.log('\nKeep these values secure and never commit them to version control!');
});
