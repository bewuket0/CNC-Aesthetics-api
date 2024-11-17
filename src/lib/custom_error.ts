/**
 * Load Module Dependencies
 */

import { type ValidationError } from 'class-validator'

export interface CustomError {
  type: string
  message: string
  status: number
}

type ErrorNames = 'AUTHENTICATION_ERROR' | 'DEFAULT_ERROR' | 'SERVER_ERROR' | 'LOGOUT_ERROR' | 'LOGIN_ERROR' | 'AUTHORIZATION_ERROR' | 'USER_CREATION_ERROR' | 'USER_NOT_FOUND' | 'PASSWORD_UPDATE_ERROR' | 'DATABASE_ERROR'
| 'FORMAT_ERROR'
const ERROR_CODES = {
  AUTHENTICATION_ERROR: {
    message: 'User not Authenticated',
    status: 401
  },
  DEFAULT_ERROR: {
    message: 'Something Went Wrong ☹ ',
    status: 400
  },
  SERVER_ERROR: {
    message: 'Seems like we are having an issue changing your password, Please try again moments later',
    status: 500
  },
  LOGOUT_ERROR: {
    message: 'You are not Logged in',
    status: 400
  },
  AUTHORIZATION_ERROR: {
    message: 'You are not authorized to perform this action',
    status: 403
  },
  USER_CREATION_ERROR: {
    message: 'User cannot be created',
    status: 400
  },
  USER_NOT_FOUND: {
    message: 'We could not find the requested user',
    status: 400
  },
  PASSWORD_UPDATE_ERROR: {
    message: 'Could not update password for the user',
    status: 400
  },
  DATABASE_ERROR: {
    message: 'Could not perform the operation on database',
    status: 500
  },
  FORMAT_ERROR: {
    message: 'format is not correct',
    status: 400
  }
}

/**
   * CustomError Type Definition.
   *
   * @param {Object} info error information
   *
   */
export function CustomErrorFunc ({ name, status, message }: { name?: ErrorNames, status?: number, message?: string }): CustomError {
  const _knownError = Object.prototype.hasOwnProperty.call(ERROR_CODES, (name ?? ''))

  if (_knownError) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const knownName = name!
    const error = ERROR_CODES[knownName as keyof typeof ERROR_CODES]
    return {
      type: knownName,
      message: message ?? error.message,
      status: error.status

    }
  }

  return {
    type: name ?? 'DEFAULT_ERROR',
    message: message ?? '',
    status: status ?? 400
  }
}

export function minimizeClassValidatorError (error: ValidationError[]): { statusCode: number, error: any } {
  let errObj = {}

  error.forEach((_err) => {
    errObj = { ...errObj, ..._err.constraints }
  })

  return {
    statusCode: 400,
    error: errObj
  }
}

// Expose Constructor
export default CustomErrorFunc
