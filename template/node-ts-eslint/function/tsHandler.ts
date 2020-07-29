/**
 * handler
 *
 * This file is for writing a function in TypeScript. If you want
 * to use JavaScript instead, create a file called "handler.js" and
 * this file will be ignored.
 */
import { IFunctionEvent, BinaryAcceptingFunctionContext } from './types'

class FunctionAsAService {
  async get (event: IFunctionEvent, context: BinaryAcceptingFunctionContext) {
    // Get some data
    return 'Got the data, success!'
  }

  async post (event: IFunctionEvent, context: BinaryAcceptingFunctionContext) {
    // Create something here and then get the result through this.get()
    const res = await this.get(event, context)
    return res
  }

  async put (event: IFunctionEvent, context: BinaryAcceptingFunctionContext) {
    // Modify some data here and then get the result through this.get()
    const res = await this.get(event, context)
    return res
  }

  // Delete is a keyword and therefore cannot be a function name
  async remove (event: IFunctionEvent, context: BinaryAcceptingFunctionContext) {
    // Delete some data here
    return 'Deleted something, yay'
  }
}

const service = new FunctionAsAService()

export default async (  event: IFunctionEvent, context: BinaryAcceptingFunctionContext ) => {
  try {
    let response;
    switch (event.method) {
      case 'GET':
        response = await service.get(event, context)
        break
      case 'POST':
        response = await service.post(event, context)
        break
      case 'PUT':
        response = await service.put(event, context)
        break
      case 'DELETE':
        response = await service.remove(event, context)
        break
      default:
        context.status(405).fail('Method not implemented')
        break
    }

    return response
  } 
  catch (err) {
    console.log(err)
    throw err
  }
};
