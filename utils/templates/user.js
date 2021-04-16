const modelName = 'User';
const folder = 'user';
const rootFolder = `app/modules/${folder}`;

module.exports = {
  modelName,
  folder,
  rootFolder,
  apiUrl: '/users',
  model: [
    {
      field: 'user_id',
      type: 'string',
      subtype: 'uuid',
      required: true,
      editable: true,
      foreign: {
        column: 'id',
        table: 'users',
      },
    },
  ],
  routes: {
    prefix: 'users',
    map: [
      {
        method: 'post',
        path: '/',
        handleFunction: 'store',
        permission: 'add-user',
      },
      {
        method: 'post',
        path: '/search',
        handleFunction: 'search',
        permission: 'add-user',
      },
      {
        method: 'get',
        path: '/',
        handleFunction: 'index',
        permission: 'view-user',
      },
      {
        method: 'get',
        path: '/paginate',
        handleFunction: 'paginate',
        permission: 'view-user',
      },
      {
        method: 'get',
        path: '/:id',
        handleFunction: 'show',
        permission: 'view-user',
      },
      {
        method: 'patch',
        path: '/:id',
        handleFunction: 'update',
        permission: 'edit-user',
      },
      {
        method: 'delete',
        path: '/:id',
        handleFunction: 'delete',
        permission: 'remove-user',
      },
      {
        method: 'post',
        path: '/show/:id',
        handleFunction: 'showDetail',
        permission: 'view-user',
      },
    ],
  },
  roles: ['add-user', 'edit-user', 'remove-user', 'view-user'],
};
