// Load Module Dependencies

import { type Request, type Response, type NextFunction } from 'express'
import moment from 'moment'
import checksession from './sessionhandler'

interface User {
  _id: string
  fullName: string
  userCode: string
  IBUsername: string
  companyName: string
  organizationID: string
  phoneNumber: string
  email: string
  permissions: string[]
  realm: string
  role: string
  isMaker: boolean
  isChecker: boolean
  caplimit: number
  sessionExpiresOn: string
  deviceUUID: string
}

function authorization (realms: string[], permissions: string[]) {
  return async function middleware (req: Request, res: Response, next: NextFunction) {
    if ((req as any)._user == null) {
      res.status(401)
      res.json({
        status: 401,
        type: 'AUTHORIZATION_ERROR',
        message: 'Missing Authenticated User'
      })
      return
    }

    const user: User = (req as any)._user

    const _PERMISSIONS: string[] = user.permissions

    let realmFound = false
    let isAuthorized = false

    realms.forEach(function (realm) {
      if (realm === '*' || user.realm === realm) {
        realmFound = true
      }
    })

    console.log('user permissions: ', permissions)
    const permissionFound = permissions.some(userpermission => _PERMISSIONS.includes(userpermission))

    if (realmFound && permissionFound) isAuthorized = true

    if (!isAuthorized) {
      res.status(401)
      res.json({
        status: 401,
        type: 'AUTHORIZATION_ERROR',
        message: 'Action Not Allowed'
      })
    } else {
      checksession(req, res, next)
      // console.log('==>', user.sessionExpiresOn, moment().isAfter(moment(user.sessionExpiresOn)))
      // if ((user.sessionExpiresOn == null) || moment().isAfter(moment(user.sessionExpiresOn))) {
      //   console.log(user.sessionExpiresOn)
      //   if (user.sessionExpiresOn == null) {
      //     console.log('    ... user session timeout not found')

      //     res
      //       .status(403)
      //       .json({
      //         message: 'Invalid Session Timeout. Please Login'
      //       })

      //     // userSession(req, user)

      //     // next();
      //   } else {
      //     console.log('    ... user session timeout expired')

      //     res
      //       .status(403)
      //       .json({
      //         message: 'Session Expired'
      //       })
      //   }
      // } else {
      //   console.log('    ... user session active')

      //   // await userSession(req, user)

      //   next()
      // }

      // next();
    }
  }
};

export default authorization
