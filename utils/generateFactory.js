const { camelCase: camel } = require('camel-case');
const { newLine } = require('./helper');

module.exports = ({ rootFolder, modelName, templateData }) => {
  let factoryFields = '';
  const tab = '    ';
  let attrs = '';

  const getDataGen = (templateItem) => {
    const dataMap = {
      number: 'faker.random.number({ min: 1, max: 10000 })',
      string: 'faker.lorem.sentence()',
      boolean: 'faker.random.boolean()',
      date: 'faker.date.recent().toISOString().substring(0, 10)',
    };

    return templateItem.factory || dataMap[templateItem.type];
  };

  templateData.forEach((template, i) => {
    factoryFields = `${factoryFields}${tab}${template.field}: ${getDataGen(
      template
    )},${newLine(templateData.length, i)}`;

    const { foreign } = template;
    if (foreign !== undefined) {
      attrs = `${attrs}if (!attrs.${template.field}) {
  attrs.${template.field} = (await a.create()).id;
}`;
    }
  });

  const template = `import Factory from '@ioc:Adonis/Lucid/Factory';
import __ModelName__ from '${rootFolder}/${camel(modelName)}';

export const __ModelName__Factory = Factory.define(__ModelName__, ({ faker }) => {
  return {
${factoryFields}
  };
})
.build();
`;
  return template.replace(/__ModelName__/g, modelName);
};
