import type { AppUser, AuthUser, Role } from "../types";

const encoder = new TextEncoder();
const localTokenSecret = "retail-pocket-local-token-v1";

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function base64Url(value: string) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return atob(padded);
}

export function createSalt() {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function sha256(value: string) {
  const hash = await window.crypto.subtle.digest("SHA-256", encoder.encode(value));
  return toHex(hash);
}

export async function hashPassword(password: string, salt: string) {
  return sha256(`${salt}:${password}`);
}

export async function verifyPassword(password: string, salt: string, expectedHash: string) {
  const actualHash = await hashPassword(password, salt);
  return actualHash === expectedHash;
}

export async function createLocalJwt(user: Pick<AppUser, "id" | "username" | "displayName" | "role">) {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      sub: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7
    })
  );
  const signature = base64Url(await sha256(`${header}.${payload}.${localTokenSecret}`));
  return `${header}.${payload}.${signature}`;
}

export async function decodeLocalJwt(token: string): Promise<AuthUser | null> {
  const [header, payload, signature] = token.split(".");

  if (!header || !payload || !signature) {
    return null;
  }

  const expectedSignature = base64Url(await sha256(`${header}.${payload}.${localTokenSecret}`));

  if (expectedSignature !== signature) {
    return null;
  }

  const decoded = JSON.parse(fromBase64Url(payload)) as {
    sub: string;
    username: string;
    displayName: string;
    role: Role;
    exp: number;
  };

  if (decoded.exp < Date.now()) {
    return null;
  }

  return {
    id: decoded.sub,
    username: decoded.username,
    displayName: decoded.displayName,
    role: decoded.role
  };
}

export function toAuthUser(user: AppUser): AuthUser {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role
  };
}
