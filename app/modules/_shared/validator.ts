import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import {
  MessagesBagContract,
  ErrorReporterContract,
} from '@ioc:Adonis/Core/Validator';
import { ValidationException } from '@adonisjs/validator/build/src/ValidationException';

type ErrorNode = Record<string, string>;

// type ValidatorType = {

// }

export default class Validator {
  constructor(protected ctx: HttpContextContract) {}

  public cacheKey = this.ctx.routeKey;

  public reporter = ValidationReporter;

  public messages = {
    enum: 'The value of {{ field }} must be in {{ options.choices }}',
    unique: '{{ field }} already inserted',
  };
}

export class ValidationReporter
  implements ErrorReporterContract<{ errors: ErrorNode }> {
  public hasErrors = false;

  /**
   * Tracking reported errors
   */
  private errors: ErrorNode = {};

  constructor(private messages: MessagesBagContract, private bail: boolean) {}

  /**
   * Invoked by the validation rules to
   * report the error
   */
  public report(
    pointer: string,
    rule: string,
    message: string,
    arrayExpressionPointer?: string,
    args?: any
  ) {
    /**
     * Turn on the flag
     */
    this.hasErrors = true;

    /**
     * Use messages bag to get the error message
     */
    const errorMessage = this.messages.get(
      pointer,
      rule,
      message,
      arrayExpressionPointer,
      args
    );

    /**
     * Track error message
     */
    this.errors[pointer] = errorMessage;
    // this.errors.push({ message: errorMessage, field: pointer })

    /**
     * Bail mode means, stop validation on the first
     * error itself
     */
    if (this.bail) {
      throw this.toError();
    }
  }

  /**
   * Converts validation failures to an exception
   */
  public toError() {
    throw new ValidationException(false, this.toJSON());
  }

  /**
   * Get error messages as JSON
   */
  public toJSON() {
    return {
      errors: this.errors,
    };
  }
}
