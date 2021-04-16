/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger';
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler';
import { AuthenticationException } from '@adonisjs/auth/build/standalone';
import UnAuthorizedException from 'app/modules/auth/authorization/unAuthorizedException';

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger);
  }

  public async handle(error, ctx) {
    // console.log('Api Error', error);
    if (error instanceof AuthenticationException) {
      return ctx.response.status(401).send({ message: 'Unauthorized access' });
    }
    if (error instanceof UnAuthorizedException) {
      return ctx.response.status(error.status).send({ message: error.message });
    }

    return super.handle(error, ctx);
  }
}
