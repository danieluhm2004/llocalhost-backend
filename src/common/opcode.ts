import { HttpException, HttpStatus } from '@nestjs/common';

export function $(opcode: number, statusCode: number, message?: string) {
  return (details: { [key: string]: any } = {}) =>
    new HttpException({ opcode, message, ...details }, statusCode);
}

export const Opcode = {
  Success: $(0, HttpStatus.OK, 'Successfully completed.'),
  InvalidError: $(
    1000,
    HttpStatus.INTERNAL_SERVER_ERROR,
    'An unexpected error occurred.',
  ),
  ValidateFailed: $(
    1001,
    HttpStatus.BAD_REQUEST,
    'Cannot validate the request.',
  ),
  NotFound: $(
    1002,
    HttpStatus.NOT_FOUND,
    'Cannot find the requested resource.',
  ),
  PermissionRequired: $(
    1003,
    HttpStatus.FORBIDDEN,
    'Only admin users can access this.',
  ),
  NotAuthorized: $(
    1004,
    HttpStatus.UNAUTHORIZED,
    'Only authenticated users can access this.',
  ),
  CannotFindUser: $(
    1005,
    HttpStatus.NOT_FOUND,
    'Cannot find the requested user.',
  ),
  CannotFindSession: $(
    1006,
    HttpStatus.NOT_FOUND,
    'Cannot find the requested session.',
  ),
  ExpiredAccessToken: $(
    1007,
    HttpStatus.UNAUTHORIZED,
    'The access token has expired.',
  ),
  CannotFindPort: $(
    1008,
    HttpStatus.NOT_FOUND,
    'Cannot find the requested port.',
  ),
};
