import Route from '@ioc:Adonis/Core/Route';
import userRoutes from 'app/modules/user/userRoutes';

Route.group(() => {
  userRoutes();
}).prefix('api');

Route.post('/api/login', '/app/modules/auth/authController.login');
Route.post('/api/register', '/app/modules/auth/authController.register');
