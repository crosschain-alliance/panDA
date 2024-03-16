import dotenv from 'dotenv'
import Fastify from 'fastify'
import { sepolia, gnosisChiado } from 'viem/chains'

import AvailController from './controllers/AvailController.js'
import CelestiaController from './controllers/CelestiaController.js'
import EthereumController from './controllers/EthereumController.js'

dotenv.config()

const fastify = Fastify({
  logger: true,
  requestTimeout: 30000,
  exposeHeadRoutes: true
})

const port = process.env.PORT || 3000

const celestiaController = new CelestiaController({
  rpcUrl: process.env.CELESTIA_RPC_URL,
  bearerToken: process.env.CELESTIA_BEARER_TOKEN
})
const ethereumController = new EthereumController({
  chain: sepolia,
  privateKey: process.env.ETHEREUM_PRIVATE_KEY,
  rpcUrl: process.env.ETHEREUM_RPC_URL
})
const availController = new AvailController({
  mnemonic: process.env.AVAIL_MNEMONIC,
  rpcUrl: process.env.AVAIL_RPC_URL
})

const gnosisController = new EthereumController({
  chain: gnosisChiado,
  privateKey: process.env.GNOSIS_PRIVATE_KEY,
  rpcUrl: process.env.GNOSIS_RPC_URL
})

fastify.route({
  method: 'OPTIONS',
  url: '/*',
  handler: async (request, reply) => {
    var reqAllowedHeaders = request.headers['access-control-request-headers']
    if (reqAllowedHeaders !== undefined) {
      reply.header('Access-Control-Allow-Headers', reqAllowedHeaders)
    }
    reply
      .code(204)
      .header('Content-Length', '0')
      .header('Access-Control-Allow-Origin', 'http://localhost:3001')
      .header('Access-Control-Allow-Credentials', true)
      .header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
      .send()
  }
})

fastify.addHook('onRequest', function (request, reply, next) {
  reply.header('Access-Control-Allow-Origin', 'http://localhost:3001')
  reply.header('Access-Control-Allow-Credentials', true)
  next()
})

fastify.listen({ port }, (_err, _address) => {
  if (_err) {
    fastify.log._error(_err)
    process.exit(1)
  }
})

fastify.post('/v1', async (_request, _reply) => {
  const responses = []
  const params = _request.body.params

  if (_request.body.method === 'ds_submitData') {
      const data = params[0]
      for (const { name, namespace, address } of params[1]) {
        if (name === 'celestia') {
          responses.push(
            celestiaController.submitBlob({
              data,
              namespace
            })
          )
        }
        if (name === 'ethereum') {
          responses.push(
            ethereumController.submitBlob({
              address,
              blob: data,
              maxFeePerGas: 180e9,
              maxPriorityFeePerGas: 1e9,
              maxFeePerBlobGas: 25e9
            })
          )
        }
        if (name === 'gnosis') {
          responses.push(
            gnosisController.submitBlob({
              address,
              blob: data,
              maxFeePerGas: 1e9,
              maxPriorityFeePerGas: 1e9,
              maxFeePerBlobGas: 1e9
            })
          )
        }
        if (name === 'avail') {
          responses.push(
            availController.submitData({
              data
            })
          )
        }
      }
    

    _reply.send({
      id: _request.body.id,
      jsonrpc: '2.0',
      result: (await Promise.all(responses)).map((_res, _index) => ({
        name: params[1][_index].name,
        data: _res
      }))
    })
    return
  }

  if (_request.body.method === 'ipcs_getProofs') {
    const verifyOn = params[1]
    for (const { height, name, namespace, hashBlock, transactionIndex } of params[2]) {
      if (name === 'celestia') {
        responses.push(
          await celestiaController.getProof({
            height,
            namespace,
            verifyOn
          })
        )
      }
      if (name === 'ethereum') {
        responses.push(
          await ethereumController.getProof({
            height,
            verifyOn
          })
        )
      }
      if (name === 'ethereum') {
        responses.push(
          await availController.getProof({
            hashBlock,
            transactionIndex,
            verifyOn
          })
        )
      }
    }

    _reply.send({
      id: _request.body.id,
      jsonrpc: '2.0',
      result: responses
    })
    return
  }
})
