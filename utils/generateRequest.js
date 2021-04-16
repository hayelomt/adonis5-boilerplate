const { getDepth } = require('./helper');

const createRule = (rules, template, foreignMap, existsPrefix, existImport) => {
  if (template.type === 'string') {
    rules = `${rules}.isString().withMessage('${template.field} must be string')`;
  } else if (template.type === 'number') {
    rules = `${rules}.isNumeric().withMessage('${template.field} must be number')`;
  } else if (template.type === 'boolean') {
    rules = `${rules}.isBoolean().withMessage('${template.field} must be boolean')`;
  }

  if (template.checkExists) {
    const mapData = foreignMap[template.field];
    existImport = `import { existsRtdbRule } from '${existsPrefix}lib/validation/exists';`;
    rules = `${rules}.custom(async (dataId${
      mapData.usesReq ? ', { req }' : ''
    }) => await existsRtdbRule({
      value: dataId,
      baseRtdbPath: \`${mapData.name}\`,
      modelName: \`${mapData.path}\`,
    }))`;
  }

  return { rules, existImport };
};

module.exports = ({ folder, templateData, foreignMap, modelName }) => {
  const depth = getDepth(folder);

  let existsPrefix = '';
  for (let i = 0; i < depth + 1; i++) {
    existsPrefix = `../${existsPrefix}`;
  }

  let rules = '';
  let editRules = '';
  let existImport = '';
  templateData.forEach((template) => {
    if (template.initialValue === undefined) {
      rules = `${rules}check('${template.field}')`;
      if (template.required) {
        rules = `${rules}.notEmpty().withMessage('${template.field} is required')`;
      } else {
        rules = `${rules}.optional().notEmpty().withMessage('${template.field} can not be empty')`;
      }

      const newRules = createRule(
        rules,
        template,
        foreignMap,
        existsPrefix,
        existImport
      );
      rules = newRules.rules;
      existImport = newRules.existImport;

      rules = `${rules},\n`;
    }

    if (template.editable) {
      editRules = `${editRules}check('${template.field}')`;
      editRules = `${editRules}.optional().notEmpty().withMessage('${template.field} can not be empty')`;

      const newRules = createRule(
        editRules,
        template,
        foreignMap,
        existsPrefix,
        existImport
      );
      editRules = newRules.rules;

      editRules = `${editRules},\n`;
    }
  });

  const template = `import { check, ValidationChain } from 'express-validator';
${existImport}

export default class __ModelName__Request {
  static create__ModelName__Rules(): ValidationChain[] {
    return [
${rules}
    ];
  }

  static edit__ModelName__Rules(): ValidationChain[] {
    return [
${editRules}
    ];
  }
}
`;
  return template.replace(/__ModelName__/g, modelName);
};
