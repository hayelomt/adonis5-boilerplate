import { Exception } from '@poppinss/utils';

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new UnAuthorizedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class UnAuthorizedException extends Exception {
  constructor(
    message: string = 'Forbidden, Unauthorized to perform operation'
  ) {
    super(message, 403);
  }
}
