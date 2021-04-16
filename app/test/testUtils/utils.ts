import test from 'japa';
import Database from '@ioc:Adonis/Lucid/Database';
import { expect } from 'chai';

export enum ApiMethod {
  GET,
  POST,
  PATCH,
  DELETE,
}

export const transact = (message: string, cb: Function) => {
  test.group(message, (group) => {
    group.beforeEach(async () => {
      // console.log('before each transaction');
      await Database.beginGlobalTransaction();
    });

    group.afterEach(async () => {
      await Database.rollbackGlobalTransaction();
    });

    cb(group);
  });
};

export const expectExceptTimestamp = (
  mainData: Record<string, any>,
  expectData: Record<string, any>
) => {
  delete mainData.created_at;
  delete mainData.updated_at;
  delete expectData.created_at;
  delete expectData.updated_at;
  expect(mainData).to.deep.equal(expectData);
};

export const getRandomItem = (arr: Array<any>) => {
  return arr[Math.floor(Math.random() * arr.length)];
};
