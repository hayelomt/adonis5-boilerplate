const { newLine, getSchemaMap } = require('./helper');

module.exports = ({ templateData, modelName }) => {
  const schemaMap = getSchemaMap();
  let importRules = false;
  const getRule = (templateItem) => {
    const itemSchema = schemaMap[templateItem.type];
    const ruleList = [];
    if (templateItem.foreign !== undefined) {
      importRules = true;
      ruleList.push([
        `rules.exists({
          column: '${templateItem.foreign.column}',
          table: '${templateItem.foreign.table}',
        })`,
      ]);
    }

    let suffix = '.optional()';
    if (ruleList.length) {
      suffix = `.optional({}, [${ruleList}])`;
    }

    return `schema.${itemSchema}${suffix}`;
  };
  const tab = '    ';

  let validationSchema = '';
  templateData.forEach((template, i) => {
    if (template.editable) {
      validationSchema = `${validationSchema}${tab}${template.field}: ${getRule(
        template
      )},${newLine(templateData.length, i)}`;
    }
  });

  const template = `import { schema${
    importRules ? ', rules ' : ''
  } } from '@ioc:Adonis/Core/Validator';
import Validator from 'app/modules/_shared/validator';

export default class E__ModelName__Val extends Validator {
  public schema = schema.create({
${validationSchema}
  });
}
`;
  return template.replace(/__ModelName__/g, modelName);
};
