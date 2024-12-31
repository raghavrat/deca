const allowedDomains = [
  '@westfordk12.us'
];

const allowedEmails = [
  'raghavdoggy@gmail.com',  // add specific emails here
];

export function isEmailAllowed(email: string): boolean {
  // Check if email is in allowed list
  if (allowedEmails.includes(email)) return true;
  
  // Check if domain is allowed
  return allowedDomains.some(domain => email.endsWith(domain));
} 