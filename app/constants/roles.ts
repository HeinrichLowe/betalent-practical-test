export const roles = {
  admin: ['ADMIN'] as const,
  manager: ['ADMIN', 'MANAGER'] as const,
  finance: ['ADMIN', 'MANAGER', 'FINANCE'] as const,
  user: ['ADMIN', 'MANAGER', 'FINANCE', 'USER'] as const,
}
