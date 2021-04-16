const { newLine, getSchemaMap } = require('./helper');

module.exports = ({ templateData, modelName }) => {
  let importRules = false;
  const schemaMap = getSchemaMap();
  const getSchema = (templateItem) => {
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
    let suffix;
    if (ruleList.length) {
      suffix = templateItem.required
        ? `({}, [${ruleList}])`
        : `.optional({}, [${ruleList}])`;
    } else {
      suffix = templateItem.required ? `()` : `.optional()`;
    }

    return `schema.${itemSchema}${suffix}`;
  };
  const tab = '    ';

  let validationSchema = '';
  templateData.forEach((template, i) => {
    validationSchema = `${validationSchema}${tab}${template.field}: ${getSchema(
      template
    )},${newLine(templateData.length, i)}`;
  });

  const template = `import { schema${
    importRules ? ', rules ' : ''
  } } from '@ioc:Adonis/Core/Validator';
import Validator from 'app/modules/_shared/validator';

export default class C__ModelName__Val extends Validator {
  public schema = schema.create({
${validationSchema}
  });
}
`;
  return template.replace(/__ModelName__/g, modelName);
};
