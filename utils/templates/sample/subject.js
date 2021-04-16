const modelName = 'Subject';
const folder = 'subject';
const rootFolder = `app/modules/${folder}`;

module.exports = {
  modelName,
  folder,
  rootFolder,
  apiUrl: '/subjects',
  model: [
    {
      field: 'subject',
      type: 'string',
      required: true,
      editable: true,
    },
    {
      field: 'code',
      type: 'string',
      required: true,
      editable: true,
      unique: true,
    },
    {
      field: 'consider_for_rank',
      type: 'boolean',
      required: true,
      editable: true,
      default: true,
    },
  ],
  routes: {
    prefix: 'subjects',
    map: [
      {
        method: 'post',
        path: '/',
        handleFunction: 'store',
        permission: 'add-subject',
      },
      {
        method: 'post',
        path: '/search',
        handleFunction: 'search',
        permission: 'add-subject',
      },
      {
        method: 'get',
        path: '/',
        handleFunction: 'index',
        permission: 'view-subject',
      },
      {
        method: 'get',
        path: '/paginate',
        handleFunction: 'paginate',
        permission: 'view-subject',
      },
      {
        method: 'get',
        path: '/:id',
        handleFunction: 'show',
        permission: 'view-subject',
      },
      {
        method: 'patch',
        path: '/:id',
        handleFunction: 'update',
        permission: 'edit-subject',
      },
      {
        method: 'delete',
        path: '/:id',
        handleFunction: 'delete',
        permission: 'remove-subject',
      },
      {
        method: 'post',
        path: '/show/:id',
        handleFunction: 'showDetail',
        permission: 'view-subject',
      },
    ],
  },
  roles: ['add-subject', 'edit-subject', 'remove-subject', 'view-subject'],
};
