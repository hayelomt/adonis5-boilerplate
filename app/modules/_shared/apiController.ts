import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import Model from './model';
import Service from './service';
import Validator from './validator';

type ApiValidators = {
  createValidator?: typeof Validator;
  editValidator?: typeof Validator;
};

export default class ApiController<T extends Model> {
  constructor(
    protected service: Service<T>,
    protected apiValidators?: ApiValidators
  ) {}

  async index({ response }: HttpContextContract) {
    const allData = await this.service.findAll();

    return response.status(200).json({ data: allData });
  }

  async paginate({ request }: HttpContextContract) {
    const data = await this.service.paginate(request.all());
    return data;
  }

  async show({ request }: HttpContextContract) {
    const data = await this.service.findOne(request.params().id);

    return data;
  }

  async showDetail({ request }: HttpContextContract) {
    const data = await this.service.findOneDetail(
      request.params().id,
      request.all()
    );

    return data;
  }

  async store({ request, response, auth }: HttpContextContract) {
    let data;
    if (this.apiValidators && this.apiValidators.createValidator) {
      data = await request.validate(this.apiValidators.createValidator as any);
    }

    const newData = await this.service.create(data, auth);

    return response.status(201).json(newData);
  }

  async update({ request }: HttpContextContract) {
    let data;
    if (this.apiValidators && this.apiValidators.editValidator) {
      data = await request.validate(this.apiValidators.editValidator as any);
    }

    const updatedData = await this.service.update(request.params().id, data);

    return updatedData;
  }

  async delete({ request }: HttpContextContract) {
    await this.service.delete(request.params().id);

    return { data: true };
  }

  async search({ request }: HttpContextContract) {
    const data = await this.service.search(request.all());

    return { data };
  }
}
