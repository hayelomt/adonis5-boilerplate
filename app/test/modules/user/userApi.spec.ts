import supertest from 'supertest';
import test from 'japa';
import { UserFactory } from './userFactory';
import {
  ApiMethod,
  BASE_URL,
  expectExceptTimestamp,
  transact,
} from 'app/test/testUtils';
import {
  generateEncoded,
  requiresAuth,
  requiresAuthorization,
  showApi,
  updatesApi,
  validateApi,
} from 'app/test/testUtils/api';
import User from 'app/modules/auth/user';
import { expect } from 'chai';
import { getCount } from 'app/services/utils';

const apiUrl = '/users';
const roles = ['add-user', 'edit-user', 'remove-user', 'view-user'];

const factory = UserFactory;

transact('User show', () => {
  test('auth', requiresAuth(`${apiUrl}/id`, ApiMethod.GET));
  test('authorize', requiresAuthorization(`${apiUrl}/id`, ApiMethod.GET));
  test('/:id', async () => {
    const data = await factory.create();
    return showApi({
      url: apiUrl,
      roles,
      data,
      model: User,
    });
  });
});

transact('User index', () => {
  test('auth', requiresAuth(apiUrl, ApiMethod.GET));
  test('authorize', requiresAuthorization(apiUrl, ApiMethod.GET));
});

transact('User create', () => {
  test('auth', requiresAuth(apiUrl, ApiMethod.POST));
  test('authorize', requiresAuthorization(apiUrl, ApiMethod.POST));
  test(
    'validate',
    validateApi(apiUrl, roles, {
      first_name: 'required validation failed',
      father_name: 'required validation failed',
      email: 'required validation failed',
      password: 'required validation failed',
      permissions: 'required validation failed',
    })
  );
  test('store', async () => {
    const data = await factory.create();
    await data.delete();

    const encoded = await generateEncoded(roles);
    const user = await User.firstOrFail();

    return supertest(BASE_URL)
      .post(apiUrl)
      .send({ ...data.serialize(), password: 'secret' })
      .set('Authorization', `Basic ${encoded}`)
      .expect(201)
      .then(async (res) => {
        const newData = (
          await User.query().where('id', '!=', user.id).firstOrFail()
        ).serialize();
        expectExceptTimestamp(
          { ...res.body, remember_me_token: null },
          { ...newData }
        );
      });
  });
});

transact('User update', () => {
  test('auth', requiresAuth(`${apiUrl}/id`, ApiMethod.PATCH));
  test('authorize', requiresAuthorization(`${apiUrl}/id`, ApiMethod.PATCH));
  test(
    'validate',
    validateApi(
      `${apiUrl}/id`,
      roles,
      {
        first_name: 'string validation failed',
      },
      { first_name: 100 },
      ApiMethod.PATCH
    )
  );
  test('update', async () => {
    const itemF = await factory.create();
    const item = (await User.findOrFail(itemF.id)).serialize();
    const updateF = await factory.create();
    const updateData = (await User.findOrFail(updateF.id)).serialize();
    await updateF.delete();

    return updatesApi({
      url: apiUrl,
      roles: roles,
      model: User,
      item,
      updateData,
      updateFields: ['first_name'],
      assertionData: {},
    });
  });
});

transact('User delete', () => {
  test('auth', requiresAuth(`${apiUrl}/id`, ApiMethod.DELETE));
  test('authorize', requiresAuthorization(`${apiUrl}/id`, ApiMethod.DELETE));
  test('delete', async () => {
    const items = await factory.createMany(2);

    const encoded = await generateEncoded(roles);

    expect(await getCount(User)).to.equal(3);

    await supertest(BASE_URL)
      .delete(`${apiUrl}/${items[0].id}`)
      .set('Authorization', `Basic ${encoded}`)
      .expect(200)
      .expect({ data: true });

    expect(await getCount(User)).to.equal(2);
    const firstItem = await User.first();
    expect(firstItem).is.not.null;
    expect(firstItem?.id).to.not.equal(items[0].id);
  });
});
