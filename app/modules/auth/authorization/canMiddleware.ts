import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UnAuthorizedException from './unAuthorizedException';

export default class CanMiddleware {
  public async handle(
    { auth }: HttpContextContract,
    next: () => Promise<void>,
    allowedPermissions: string[]
  ) {
    const userPermissions: string[] = JSON.parse(
      auth.user?.permissions || '[]'
    );
    // console.log({
    //   routePermissions: allowedPermissions,
    //   hasPermission: allowedPermissions.every((i) =>
    //     userPermissions.includes(i)
    //   ),
    //   userPermissions,
    // });
    if (!allowedPermissions.every((i) => userPermissions.includes(i))) {
      throw new UnAuthorizedException();
    }
    // console.log(auth.user.serialize());

    await next();
  }
}
