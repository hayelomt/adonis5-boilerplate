const { camelCase: camel } = require('camel-case');
const path = require('path');
const fs = require('fs');

module.exports = ({ modulePath, modelName }) => {
  const importCreateVal = fs.existsSync(
    path.join(modulePath, `c${modelName}Val.ts`)
  );
  const importEditVal = fs.existsSync(
    path.join(modulePath, `e${modelName}Val.ts`)
  );

  let imports = '';
  let validators = '';
  if (importCreateVal) {
    imports = `${imports}import C__ModelName__Val from './c__ModelName__Val';`;
    validators = `${validators}      createValidator: C__ModelName__Val,`;
  }
  if (importEditVal) {
    imports = `${imports}
import E__ModelName__Val from './e__ModelName__Val';`;
    validators = `${validators}
      editValidator: E__ModelName__Val,`;
  }

  const template = `import ApiController from 'app/modules/_shared/apiController';
import __ModelName__ from './${camel(modelName)}';
import __ModelName__Service from './${camel(modelName)}Service';
${imports}

export default class __ModelName__Controller extends ApiController<__ModelName__> {
  constructor(protected service = new __ModelName__Service()) {
    super(service, {
${validators}
    });
  }
}
`;
  return template.replace(/__ModelName__/g, modelName);
};
