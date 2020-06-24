import {merge} from 'lodash'

import chipmunk from 'chowchow/src/manager/chipmunk'

export const getSession = async (): Promise<any> => {
  const session = (await chipmunk.action(`um.session`, `full`, { raw: true })).object

  session.isPublic          = session[`@type`] === `session/public`
  session.isRecommendation  = session[`@type`] === `session/recommendation`
  session.isAuthenticated   = session[`@type`] === `session`

  const config = chipmunk.currentConfig()

  chipmunk.updateConfig({
    headers: merge({
      'Affiliation-Id': session.affiliation.id,
      'Role-Id': session.role && session.role.id,
    }, config.headers)
  })

  return session
}

export const login = async (email: string, password: string, domain: string): Promise<any> => {
  const headers = {
    'Affiliation-Id': null,
    'Origin': domain,
  }

  const session = (await chipmunk.action(`um.session`, `create`, {
    headers,
    body: { email, password },
  })).object

  chipmunk.updateConfig({ headers: { 'Session-Id': session.id } })

  const fullSession = await getSession()

  chipmunk.updateConfig({ headers: { 'Role-Id': fullSession.role.id } })

  return fullSession
}

export const logout = () => {
  chipmunk.updateConfig({ headers: { 'Session-Id': null } })
}
