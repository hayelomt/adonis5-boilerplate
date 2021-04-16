import { v4 } from 'uuid';
import { DateTime } from 'luxon';
import { column, BaseModel, beforeCreate } from '@ioc:Adonis/Lucid/Orm';

export default class Model extends BaseModel {
  public static selfAssignPrimaryKey = true;

  @column({ isPrimary: true })
  public id: string;

  @beforeCreate()
  public static assignUuid(model: Model) {
    if (!model.id) {
      model.id = v4();
    }
  }

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;
}
