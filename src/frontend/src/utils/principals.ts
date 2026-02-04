import { Principal } from '@dfinity/principal';

// Validate principal text format
export function validatePrincipal(principalText: string): { valid: boolean; error?: string } {
  if (!principalText || !principalText.trim()) {
    return { valid: false, error: 'Principal ID is required' };
  }

  try {
    Principal.fromText(principalText.trim());
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid principal ID format' };
  }
}

// Normalize and deduplicate principal list
export function normalizePrincipals(principals: string[]): string[] {
  const trimmed = principals.map(p => p.trim()).filter(p => p.length > 0);
  const unique = Array.from(new Set(trimmed));
  return unique;
}

// Check if principal is valid format
export function isPrincipalValid(principalText: string): boolean {
  return validatePrincipal(principalText).valid;
}
