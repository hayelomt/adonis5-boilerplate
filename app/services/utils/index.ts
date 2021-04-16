import Database from '@ioc:Adonis/Lucid/Database';
import Model from 'app/modules/_shared/model';

export const getAuthGuard = () => 'auth:api,basic';
// process.env.NODE_ENV === 'testing' ? 'auth:basic,api' : 'auth:basic,api';

export const getCount = async (model: typeof Model): Promise<number> => {
  return (await model.query().count('* as count').first()).count;
};

export const getAll = async (model: typeof Model) => {
  return (await model.all()).map((i) => i.serialize());
};

export const getOne = async (model: typeof Model, id: string) => {
  return (await model.findOrFail(id)).serialize();
};

export const allPromises = async (items: any[], cb: Function) => {
  const promises: Promise<any>[] = [];
  items.forEach((item) => promises.push(cb(item)));
  await Promise.all(promises);
};

export const transactify = async (cb: Function) => {
  if (process.env.NODE_ENV !== 'testing') {
    await Database.beginGlobalTransaction();
    try {
      await cb();
      await Database.commitGlobalTransaction();
    } catch (err) {
      await Database.rollbackGlobalTransaction();
      throw err;
    }
  } else {
    await cb();
  }
};
