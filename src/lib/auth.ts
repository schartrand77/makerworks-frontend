export interface AuthUser {
  groups?: string[]
}

export function isAdmin(user?: AuthUser): boolean {
  return user?.groups?.includes('MakerWorks-Admin') ?? false
}

export function isUser(user?: AuthUser): boolean {
  return user?.groups?.includes('MakerWorks-User') ?? false
}
