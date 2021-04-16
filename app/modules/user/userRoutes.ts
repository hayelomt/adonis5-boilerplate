import Route from '@ioc:Adonis/Core/Route';
import { getAuthGuard } from 'app/services/utils';

export default () => {
  Route.group(() => {
    Route.post('/', '/app/modules/user/userController.store').middleware([
      getAuthGuard(),
      'can:add-user',
    ]);

    Route.post(
      '/search',
      '/app/modules/user/userController.search'
    ).middleware([getAuthGuard(), 'can:add-user']);

    Route.get('/', '/app/modules/user/userController.index').middleware([
      getAuthGuard(),
      'can:view-user',
    ]);

    Route.get(
      '/paginate',
      '/app/modules/user/userController.paginate'
    ).middleware([getAuthGuard(), 'can:view-user']);

    Route.get('/:id', '/app/modules/user/userController.show').middleware([
      getAuthGuard(),
      'can:view-user',
    ]);

    Route.patch('/:id', '/app/modules/user/userController.update').middleware([
      getAuthGuard(),
      'can:edit-user',
    ]);

    Route.delete('/:id', '/app/modules/user/userController.delete').middleware([
      getAuthGuard(),
      'can:remove-user',
    ]);

    Route.post(
      '/show/:id',
      '/app/modules/user/userController.showDetail'
    ).middleware([getAuthGuard(), 'can:view-user']);
  }).prefix('users');
};
