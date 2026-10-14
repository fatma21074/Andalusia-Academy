export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailProblem(email: string): string | null {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_PATTERN.test(email.trim())) return "Enter a valid email address.";
  return null;
}

export function passwordProblem(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Use at least one letter and one number.";
  return null;
}

export function requiredProblem(value: string, label: string): string | null {
  return value.trim() ? null : `${label} is required.`;
}

/** Drops the entries that are null, leaving only the fields that have a problem. */
export function onlyProblems(problems: Record<string, string | null>): Record<string, string> {
  return Object.fromEntries(Object.entries(problems).filter((entry): entry is [string, string] => entry[1] !== null));
}
