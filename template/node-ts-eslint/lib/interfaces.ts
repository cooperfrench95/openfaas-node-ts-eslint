/**
 * interfaces
 */

/* Node modules */
import { IncomingHttpHeaders } from 'http';

/* Third-party modules */
import { ParsedQs } from 'qs';

/* Files */

export interface IKeyValue {
  [key: string]: any;
}

interface IFunctionContext {
  httpHeaders: IKeyValue;
  httpStatus: number;
  fail(value: any): void;
  headers(): IKeyValue;
  headers(IKeyValue): IFunctionContext;
  status(): number;
  status(number): IFunctionContext;
  succeed(value: any): void;
}

export type BinaryCallback = (err: any, message: any, isBinary: Boolean, _self: BinaryAcceptingFunctionContext) => void

export interface BinaryAcceptingFunctionContext extends IFunctionContext {
  cb: BinaryCallback,
  fail: any,
  succeed: any,
}

export interface IFunctionEvent<ReqBody = any, ReqQuery = ParsedQs> {
  body: ReqBody;
  headers: IncomingHttpHeaders;
  method: string;
  query: ReqQuery;
  path: string;
}

export interface IHandler {
  (event: IFunctionEvent, context: BinaryAcceptingFunctionContext): any | Promise<any>;
}
