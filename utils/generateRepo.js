const { camelCase: camel } = require('camel-case');

module.exports = ({ modelName }) => {
  const template = `import { Repo } from 'app/modules/_shared/repo';
import __ModelName__ from './${camel(modelName)}';

export default class __ModelName__Repo extends Repo<__ModelName__> {
  constructor() {
    super(__ModelName__);
  }
}
`;
  return template.replace(/__ModelName__/g, modelName);
};
