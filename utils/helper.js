exports.getDepth = (str) => (str.match(/\//) || []).length + 1;
exports.newLine = (length, i) => (i === length - 1 ? '' : '\n');
exports.getSchemaMap = () => ({
  number: 'number',
  string: 'string',
  enum: 'enum',
  boolean: 'boolean',
});
