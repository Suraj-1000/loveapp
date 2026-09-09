/**
 * Unique Invite Code Generator
 */
export function generateInviteCode(recipientName = '') {
  const cleanName = recipientName
    ? recipientName.toLowerCase().replace(/[^a-z0-9]/g, '')
    : 'date';
  
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${cleanName}-${randomSuffix}`;
}
