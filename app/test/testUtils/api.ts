import { base64 } from '@poppinss/utils';
import _ from 'lodash';
import Model from 'app/modules/_shared/model';
import { expect } from 'chai';
import supertest from 'supertest';
import { BASE_URL } from '.';
import { UserFactory } from '../modules/auth/userFactory';
import { ApiMethod, expectExceptTimestamp } from './utils';
import { getCount } from 'app/services/utils';

const buildSuperInstance = (url: string, method: ApiMethod): supertest.Test => {
  let instance: supertest.Test;
  if (method === ApiMethod.PATCH) {
    instance = supertest(BASE_URL).patch(url);
  } else if (method === ApiMethod.POST) {
    instance = supertest(BASE_URL).post(url);
  } else if (method === ApiMethod.DELETE) {
    instance = supertest(BASE_URL).delete(url);
  } else {
    instance = supertest(BASE_URL).get(url);
  }

  return instance;
};

const fetchApi = async (
  { url, roles, data, model }: FetchApiArgs,
  formatUrl: Function,
  formatData: Function
) => {
  const instance = (await model.findOrFail(data.id)).serialize();
  const encoded = await generateEncoded(roles);

  await supertest(BASE_URL)
    .get(formatUrl(url, instance.id))
    .set('Authorization', `Basic ${encoded}`)
    .expect(200)
    .then(async (res) => {
      // console.log(instance, res.body);
      expect(res.body).to.deep.equal(formatData(instance));
    });
};

export type CreateApiArgs = {
  url: string;
  roles: string[];
  data: Record<string, any>;
  model: typeof Model;
  assertionData?: Record<string, any>;
};

export type UpdateApiArgs = {
  url: string;
  roles: string[];
  model: typeof Model;
  item: Record<string, any>;
  updateData: Record<string, any>;
  updateFields: string[];
  assertionData?: Record<string, any>;
};

export type DeleteApiArgs = {
  url: string;
  roles: string[];
  model: typeof Model;
  itemId: string;
  remaining?: number;
};

export type FetchApiArgs = {
  url: string;
  roles: string[];
  data: Record<string, any>;
  model: typeof Model;
};

export const generateEncoded = async (roles: string[]) => {
  const { email } = await UserFactory.merge({
    permissions: JSON.stringify(roles),
  }).create();

  return base64.encode(`${email}:secret`);
};

export const showApi = (fetchArg: FetchApiArgs) =>
  fetchApi(
    fetchArg,
    (url, id) => `${url}/${id}`,
    (instance) => instance
  );

export const paginateApi = (fetchArg: FetchApiArgs) =>
  fetchApi(
    fetchArg,
    (url, _id) => `${url}/paginate?page=1&perPage=5`,
    (instance) => ({
      meta: {
        total: 1,
        per_page: 5,
        current_page: 1,
        last_page: 1,
        first_page: 1,
        first_page_url: '/?page=1',
        last_page_url: '/?page=1',
        next_page_url: null,
        previous_page_url: null,
      },
      data: [instance],
    })
  );

export const indexApi = (fetchArg: FetchApiArgs) =>
  fetchApi(
    fetchArg,
    (url, _id) => url,
    (instance) => ({
      data: [instance],
    })
  );

export const validateApi = (
  url: string,
  roles: string[],
  errorMessages: Record<string, any>,
  data: Record<string, any> = {},
  method: ApiMethod = ApiMethod.POST
) => async () => {
  const encoded = await generateEncoded(roles);

  await buildSuperInstance(url, method)
    .set('Authorization', `Basic ${encoded}`)
    .send(data)
    .expect(422)
    .expect({ errors: errorMessages });
};

export const deleteApi = async ({
  url,
  roles,
  model,
  itemId,
  remaining = 1,
}: DeleteApiArgs) => {
  const encoded = await generateEncoded(roles);

  expect(await getCount(model)).to.equal(remaining + 1);

  await supertest(BASE_URL)
    .delete(`${url}/${itemId}`)
    .set('Authorization', `Basic ${encoded}`)
    .expect(200)
    .expect({ data: true });

  expect(await getCount(model)).to.equal(1);
  const firstItem = await model.first();
  expect(firstItem).is.not.null;
  expect(firstItem?.id).to.not.equal(itemId);
};

export const createsApi = async ({
  url,
  roles,
  data,
  model,
  assertionData = {},
}: CreateApiArgs) => {
  const encoded = await generateEncoded(roles);

  return supertest(BASE_URL)
    .post(url)
    .send(data)
    .set('Authorization', `Basic ${encoded}`)
    .expect(201)
    .then(async (res) => {
      const newData = (await model.firstOrFail()).serialize();
      // console.log({ body: res.body, ass: { ...newData, ...assertionData } });
      expectExceptTimestamp(res.body, { ...newData, ...assertionData });
    });
};

export const updatesApi = async ({
  url,
  roles,
  model,
  item,
  updateData,
  updateFields,
  assertionData = {},
}: UpdateApiArgs) => {
  const encoded = await generateEncoded(roles);

  const filteredData = _.pick(updateData, updateFields);

  return supertest(BASE_URL)
    .patch(`${url}/${item.id}`)
    .send({ ...filteredData })
    .set('Authorization', `Basic ${encoded}`)
    .then(async (res) => {
      const updatedModel = (await model.findOrFail(item.id)).serialize();
      expect(res.status).to.equal(200);
      expectExceptTimestamp(res.body, {
        ...updatedModel,
        ...filteredData,
      });
      expectExceptTimestamp(updatedModel, {
        ...item,
        ...filteredData,
        ...assertionData,
      });
    });
};

export const requiresAuth = (
  url: string,
  method: ApiMethod = ApiMethod.GET
) => async () => {
  await buildSuperInstance(url, method)
    .expect(401)
    .expect({ message: 'Unauthorized access' });
};

export const requiresAuthorization = (
  url: string,
  method: ApiMethod = ApiMethod.GET
) => async () => {
  const encoded = await generateEncoded([]);

  await buildSuperInstance(url, method)
    .set('Authorization', `Basic ${encoded}`)
    .expect(403)
    .expect({ message: 'Forbidden, Unauthorized to perform operation' });
};
