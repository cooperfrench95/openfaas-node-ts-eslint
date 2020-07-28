/**
 * functionEvent
 */

/* Node modules */
import { IncomingHttpHeaders } from 'http';

/* Third-party modules */
import * as express from 'express';

/* Files */
import { IFunctionEvent } from './interfaces';

export default class FunctionEvent implements IFunctionEvent {
  body: any;

  headers: IncomingHttpHeaders;

  method: string;

  query: any;

  path: string;

  constructor(req: express.Request) {
    this.body = req.body;
    this.headers = req.headers;
    this.method = req.method;
    this.query = req.query;
    this.path = req.path;
  }
}
