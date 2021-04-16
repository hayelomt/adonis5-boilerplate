import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm';
import Model from './model';

export type QueryType = ModelQueryBuilderContract<typeof Model, Model>;

export const Keys = Object.keys;
