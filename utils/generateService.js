const { camelCase: camel } = require('camel-case');

module.exports = ({ modelName }) => {
  const template = `import Service from 'app/modules/_shared/service';
import __ModelName__ from './${camel(modelName)}';
import __ModelName__Repo from './${camel(modelName)}Repo';

export default class __ModelName__Service extends Service<__ModelName__> {
  constructor() {
    super(new __ModelName__Repo());
  }
}
`;
  return template.replace(/__ModelName__/g, modelName);
};
