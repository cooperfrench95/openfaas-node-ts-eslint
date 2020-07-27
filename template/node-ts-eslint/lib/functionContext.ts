/**
 * functionContext
 */

/* eslint-disable class-methods-use-this */

/* Node modules */

/* Third-party modules */

/* Files */
import { BinaryAcceptingFunctionContext, IKeyValue, BinaryCallback } from './interfaces';

export default class FunctionContext implements BinaryAcceptingFunctionContext {

  public cb: BinaryCallback;
  public cbCalled: number = 0;
  constructor(cb: BinaryCallback) {
      this.cb = cb
  }
  public httpHeaders: IKeyValue = {};
  public httpStatus: number = 200;

  fail(value: any, isBinary?: Boolean): void {
    let message
    this.cbCalled++
    this.cb(value, message, isBinary, this)
  }

  headers(): IKeyValue;
  headers(value: IKeyValue): BinaryAcceptingFunctionContext;
  headers(value?: IKeyValue): any {
    if (!value) {
      return this.httpHeaders;
    }

    this.httpHeaders = value;
    return this;
  }

  status(): number;
  status(value: number): BinaryAcceptingFunctionContext;
  status(value?: number): any {
    if (!value) {
      return this.httpStatus;
    }

    this.httpStatus = value;
    return this;
  }

  succeed(value: any, isBinary?: Boolean): void {
    let err
    this.cbCalled++
    console.log('value in succeed', value)
    this.cb(err, value, isBinary, this)
  }
}
