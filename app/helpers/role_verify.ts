import type { Response } from '@adonisjs/core/http'
import type User from '#models/user'

/**
 * Verifica se o usuário tem uma das roles permitidas.
 * Se não tiver, retorna uma resposta não autorizada.
 * @param user - O usuário autenticado.
 * @param allowedRoles - Lista de roles permitidas.
 * @param response - O contexto HTTP do AdonisJS.
 * @returns `true` se o usuário tiver permissão, ou a resposta não autorizada.
 */

export function roleVerify(user: User, allowedRoles: string[], response: Response): true | void {
  if (!allowedRoles.includes(user.role)) {
    return response.forbidden({ message: 'Access Denied' })
  }
  return true
}
