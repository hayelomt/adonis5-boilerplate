const { camelCase: camel } = require('camel-case');

module.exports = ({ folder, routes, modelName, prefix }) => {
  let routeList = '';
  routes.forEach(({ method, path, handleFunction, permission }) => {
    routeList = `${routeList}
    Route.${method}(
      '${path}',
      '/app/modules/${folder}/${camel(modelName)}Controller.${handleFunction}'
    ).middleware([getAuthGuard(), 'can:${permission}']);
`;
  });

  const template = `import Route from '@ioc:Adonis/Core/Route';
import { getAuthGuard } from 'app/services/utils';

export default () => {
  Route.group(() => {${routeList}  }).prefix('${prefix}');
};
`;
  return template.replace(/__ModelName__/g, modelName);
};
