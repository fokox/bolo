import crypto from "crypto";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generates a clean, short, URL-safe random string identifier (e.g. "k7m2x9q")
 * to decouple the public link from the user's private username.
 */
export function generateLinkId(length = 7): string {
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return result;
}
