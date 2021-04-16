import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().primary();

      table.string('first_name').notNullable();
      table.string('father_name').notNullable();
      table.string('email', 255).notNullable();
      table.string('password', 180).notNullable();
      table.string('remember_me_token').nullable();
      table.text('permissions').defaultTo('[]');

      table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
