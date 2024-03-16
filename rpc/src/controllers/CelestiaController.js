import axios from 'axios'
import { encodeAbiParameters, parseAbiParameters } from 'viem'

class CelestiaController {
  constructor({ rpcUrl, bearerToken }) {
    this.client = axios.create({
      baseURL: rpcUrl,
      headers: {
        Authorization: 'Bearer ' + bearerToken
      }
    })
  }

  async getProof({ height, verifyOn, namespace }) {
    let response

    // blobstreamX
    if (verifyOn === 'ethereum') {
      const { data: headerByHeightRes } = await this.client.post('/', {
        jsonrpc: '2.0',
        method: 'header.GetByHeight',
        id: 1,
        params: [height]
      })

      const { data: sharesByNamespaceRes } = await this.client.post('/', {
        jsonrpc: '2.0',
        method: 'share.GetSharesByNamespace',
        id: 1,
        params: [headerByHeightRes.result, namespace]
      })

      const [{ proof }] = sharesByNamespaceRes.result

      // TODO: enable rest api on my celestia node
      const {
        data: { result }
      } = await this.client.get(
        `https://rpc.celestia-mocha.com/prove_shares?height=${height}&startShare=${proof.start}&endShare=${proof.end}`
      )

      // NOTE: https://docs.celestia.org/developers/blobstream-proof-queries#converting-the-proofs-to-be-usable-in-the-daverifier-library
      // FIXME: fix encoding
      try {
        response = encodeAbiParameters(
          parseAbiParameters(
            'address, (bytes[], (uint256, uint256 ((bytes1 bytes28) (bytes1 bytes28) bytes32)[], (bytes1, bytes28), ((bytes1 bytes28) (bytes1 bytes28) bytes32)[], ((bytes32[], uint256, uint256), (AttestationProof))[]), bytes32 )'
          ),
          [
            '0xf6b3239143d33aefc893fa5411cdc056f8080418',
            [
              '0x' + Buffer.from(result.data, 'base64').toString('hex'),
              result.share_proofs.map(({ start, end, nodes }) => [
                start,
                end,
                nodes.map((_node) => {
                  const hexNode = Buffer.from(_node, 'base64').toString('hex')
                  const min = hexNode.slice(0, 58)
                  const max = hexNode.slice(58, 116)
                  const digest = hexNode.slice(116, 138)

                  return [
                    [min.slice(2), min.slice(2, 56)], //min
                    [max.slice(2), max.slice(2, 56)], //max,
                    digest
                  ]
                })
              ]),
              [
                result.proofs.map(({ index, total, aunts }) => [
                  aunts.map((_aunt) => '0x' + Buffer.from(_aunt, 'base64').toString('hex')),
                  index,
                  total
                ])
              ],
              [
                0, //TODO the attestation nonce that commits to the data root tuple.,
                [0 /*height*/, '0000000000000000000000000000000000000000000000000000000000000000' /*dataRoot*/],
                ['0x' /*proof*/]
              ]
            ]
          ]
        )
      } catch (_err) {
        response = '0x'
      }
    }

    return response
  }

  async submitBlob({ namespace, data } = {}) {
    const params = [
      [
        {
          namespace: namespace.toString(),
          data: data.toString(),
          share_version: 0,
          index: -1
        }
      ],
      0.003
    ]

    const { data: response } = await this.client.post('/', {
      jsonrpc: '2.0',
      method: 'blob.Submit',
      id: 1,
      params
    })

    return response.result
  }
}

export default CelestiaController
