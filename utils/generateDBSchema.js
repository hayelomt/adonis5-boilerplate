const path = require('path');
const fs = require('fs');
const { newLine } = require('./helper');

module.exports = ({ templateData }) => {
  const stringMap = {
    default: "string('__FIELD')",
    text: "text('__FIELD')",
    long: "text('__FIELD', 'longtext')",
    medium: "text('__FIELD', 'mediumtext')",
    uuid: "uuid('__FIELD')",
  };
  const numberMap = {
    default: "integer('__FIELD')",
    integer: "integer('__FIELD')",
    float: "float('__FIELD')",
    decimal: "decimal('__FIELD', 15, 2)",
  };
  const booleanMap = {
    default: "boolean('__FIELD')",
  };
  const enumMap = {
    default: "enum('__FIELD', Object.values())",
  };
  const dateMap = {
    default: "date('__FIELD')",
  };
  const typeMap = {
    string: stringMap,
    number: numberMap,
    boolean: booleanMap,
    enum: enumMap,
    date: dateMap,
  };
  const getType = (templateItem) => {
    let mainTemplate = `table.${
      typeMap[templateItem.type][templateItem.subtype || 'default']
    }`.replace('__FIELD', templateItem.field);
    const { foreign } = templateItem;
    if (templateItem.required) {
      mainTemplate = `${mainTemplate}.notNullable()`;
    }
    if (templateItem.unique) {
      mainTemplate = `${mainTemplate}.unique()`;
    }
    if (templateItem.default !== undefined) {
      mainTemplate = `${mainTemplate}.defaultTo(${templateItem.default})`;
    }
    if (foreign !== undefined) {
      mainTemplate = `${mainTemplate}.references('${foreign.column}').inTable('${foreign.table}')`;
    }

    return `${mainTemplate};`;
  };

  let factoryTemplate = "table.uuid('id').unique().primary();\n\n";
  templateData.forEach((template, i) => {
    // console.log(template.field, getType(template));
    factoryTemplate = `${factoryTemplate}${getType(template)}${newLine(
      templateData.length,
      i
    )}`;
  });

  factoryTemplate = `${factoryTemplate}\n\ntable.timestamps(true, true);`;

  fs.writeFileSync(path.join(__dirname, 'schema.txt'), `${factoryTemplate}\n`);
};
