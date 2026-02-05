/**
 * Generate a stable Client ID from a Principal ID
 * Format: CA-XXXXXX (6 alphanumeric characters)
 */
export function generateClientId(principalId: string): string {
  if (!principalId) return 'CA-000000';
  
  // Create a simple hash from the principal ID
  let hash = 0;
  for (let i = 0; i < principalId.length; i++) {
    const char = principalId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to positive number and create 6-character alphanumeric string
  const absHash = Math.abs(hash);
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  let num = absHash;
  
  for (let i = 0; i < 6; i++) {
    result = chars[num % chars.length] + result;
    num = Math.floor(num / chars.length);
  }
  
  return `CA-${result}`;
}
