/**
 * index
 */

/* Node modules */

/* Third-party modules */
import * as express from 'express';
import * as bodyParser from 'body-parser';

/* Files */
import FunctionEvent from './lib/functionEvent';
import { IHandler } from './lib/interfaces';
import FunctionContext from './lib/functionContext';


const cors = require('cors')
const helmet = require('helmet')

const app = express.default();
app.disable('x-powered-by');


var whitelist = process.env.WHITELISTURLS  !== null ? process.env.WHITELISTURLS : []

var corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || whitelist.indexOf('*') !== -1 || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const isArray = (input: any): boolean => !!input && input.constructor === Array;

const isObject = (input: any): boolean => !!input && input.constructor === Object;

const loadHandler = async (): Promise<IHandler> => {
  const jsFile = './function/handler';
  const tsFile = './function/tsHandler';

  let handler: any;
  try {
    /* Prioritise JS */
    // @ts-ignore
    handler = await import(jsFile);
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      /* Script error - throw */
      throw err;
    }

    try {
      /* No JS file - try TS instead */
      // @ts-ignore
      handler = await import(tsFile);
    } catch (tsErr) {
      if (tsErr.code === 'MODULE_NOT_FOUND') {
        throw new Error(`No ${jsFile}.js or ${tsFile}.ts found`);
      }

      throw tsErr;
    }
  }

  if (handler.default) {
    return handler.default;
  }

  return handler;
};

const prepareBinary = function (err: Error, result: any): Buffer {
  if (err) {
      return Buffer.from(err)
  }
  return Buffer.from(result)
}

const middleware = async (req: express.Request, res: express.Response) => {
  let cb = (err: Error, functionResult: any, isBinary: Boolean, _self: FunctionContext) => {
    const fnResult = isArray(functionResult) || isObject(functionResult) ? JSON.stringify(functionResult) : functionResult;
    if (isBinary) {
        res.status(_self.status())
        res.setHeader('Content-Transfer-Encoding', 'binary')
        res.setHeader('Content-Type', 'application/octet-stream')

        return res.send(prepareBinary(err, fnResult))
    }
    if (err) {
        console.error(err)
        return res.status(_self.status()).send(err.toString ? err.toString() : err)
    }
    
    res.set(_self.headers()).status(_self.status()).send(fnResult);
  }
  const fnEvent = new FunctionEvent(req);
  const fnContext = new FunctionContext(cb);

  let output: any;
  try {
    const handler = await loadHandler();

    output = await handler(fnEvent, fnContext);
    if (!fnContext.cbCalled) {
      // Handles the case where response is returned directly from the handler rather than using context.succeed()
      fnContext.succeed(output)
    }
  } catch (err) {
    console.error(err);
    output = err.toString ? err.toString() : err;
    fnContext.httpStatus = 500;
    fnContext.fail(err)
  }

};

app.use(bodyParser.json())
app.use(bodyParser.raw({ type: 'application/octet-stream' }))
app.use(helmet())
app.disable('x-powered-by')
app.use(cors(corsOptions))
app.post('/*', middleware)
app.get('/*', middleware)
app.patch('/*', middleware)
app.put('/*', middleware)
app.delete('/*', middleware)

const port = process.env.http_port || 3000

app.listen(port, () => {
    console.log(`OpenFaaS Node.js listening on port: ${port}`)
})

