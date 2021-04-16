import _ from 'lodash';
import { Keys, QueryType } from './types';
import Model from './model';

export type Filter = {
  op: string;
  value: any;
};

const recursivePreload = (query: QueryType, relations: Record<string, any>) => {
  const keys = Keys(relations);
  keys.forEach((key) => {
    const { where, ...childRel } = relations[key];

    if (_.isEmpty(childRel)) {
      return query.preload(key as any, (builder) => {
        if (!_.isEmpty(where)) {
          where.forEach(({ field, op, value }) => {
            builder.where(field, op, value);
          });
        }
      });
    } else {
      return query.preload(key as any, (builder) => {
        if (!_.isEmpty(where)) {
          where.forEach(({ field, op, value }) => {
            builder = builder.where(field, op, value);
          });
        }
        recursivePreload(builder, childRel);
      });
    }
  });
};

const preloadRelations = (query: QueryType, withs: Record<string, any>) => {
  if (!_.isEmpty(withs)) {
    recursivePreload(query, withs);
  }
  return query;
};

const recursiveWhereHas = (
  query: QueryType,
  hasFilters: Record<string, any>
) => {
  const keys = Keys(hasFilters);
  keys.forEach((key) => {
    const { filters, ...childRel } = hasFilters[key];
    if (!_.isEmpty(filters)) {
      query = query.whereHas(key as any, (builder) => {
        filters.forEach(({ field, op, value }) => {
          builder.where(field, op, value);
        });
      });
    }
    if (!_.isEmpty(childRel)) {
      return query.whereHas(key as any, (builder) => {
        recursiveWhereHas(builder, childRel);
      });
    }
  });
};

const whereHasFilters = (query: QueryType, filters: Record<string, any>) => {
  if (!_.isEmpty(filters)) {
    recursiveWhereHas(query, filters);
  }
  return query;
};

const applyMainFilters = (
  query: QueryType,
  mainFilters: Record<string, Filter>
) => {
  if (!_.isEmpty(mainFilters)) {
    const fields = Keys(mainFilters);
    fields.forEach((field) => {
      const { op, value } = mainFilters[field];
      query = query.where(field, op, value);
    });
  }

  return query;
};

export default class SearchService {
  static search(model: typeof Model, searchParams: Record<string, any>) {
    let { withs, whereHas, mainFilters } = searchParams;

    let query = model.query();

    query = preloadRelations(query, withs);
    query = whereHasFilters(query, whereHas);
    query = applyMainFilters(query, mainFilters);

    return query;
  }
}
