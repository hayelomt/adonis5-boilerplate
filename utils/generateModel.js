const { camelCase: camel } = require('camel-case');
const { pascalCase } = require('pascal-case');

module.exports = ({ templateData, modelName }) => {
  const typeMap = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    enum: 'string',
    date: 'DateTime',
  };
  let ormImport = '';
  let mappedTemplate = '';
  let relations = '';
  let lux = '';
  templateData.forEach((template, i) => {
    mappedTemplate = `${mappedTemplate}  @column${
      template.type === 'date' ? '.date' : ''
    }()\n  public ${template.field}: ${typeMap[template.type]};${
      i === templateData.length - 1 ? '' : '\n\n'
    }`;

    if (template.type === 'date') {
      lux = `import { DateTime } from 'luxon';`;
    }

    if (template.foreign !== undefined) {
      ormImport = ', BelongsTo, belongsTo';
      const relation = camel(template.field.replace('_id', ''));
      relations = `${relations}
  @belongsTo(() => ${pascalCase(relation)}, {
    foreignKey: '${template.field}'
  })
  public ${relation}: BelongsTo<typeof ${pascalCase(relation)}>;
      `;
    }
  });

  const template = `import { column${ormImport} } from '@ioc:Adonis/Lucid/Orm';
import Model from 'app/modules/_shared/model';
${lux}

export default class __ModelName__ extends Model {
${mappedTemplate}

${relations}
}
`;
  return template.replace('__ModelName__', modelName);
};
