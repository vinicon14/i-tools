export async function matchesAdminCredentials(
  username: string,
  password: string,
  expectedUsername: string,
  expectedPassword: string,
) {
  if (!expectedUsername || !expectedPassword) return false;
  const digest = (value: string) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  const [actual, expected] = await Promise.all([
    digest(JSON.stringify([username, password])),
    digest(JSON.stringify([expectedUsername, expectedPassword])),
  ]);
  const a = new Uint8Array(actual);
  const b = new Uint8Array(expected);
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return difference === 0;
}