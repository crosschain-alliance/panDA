import { Keyring } from '@polkadot/api'
import { encodeAbiParameters, parseAbiParameters } from 'viem'

import { createApi, sendTx } from '../utils/avail-common.js'

class AvailController {
  constructor({ rpcUrl, mnemonic }) {
    this.mnemonic = mnemonic
    createApi(rpcUrl).then((_client) => {
      this.client = _client
    })
  }

  async getProof({ hashBlock, verifyOn, transactionIndex }) {
    /*if (verifyOn === 'ethereum') {
      const proof = await this.client.rpc.kate.queryDataProof(transactionIndex, hashBlock)
      // TODO: get block number by hashBlock
      return encodeAbiParameters(
        parseAbiParameters('uint32, bytes32[] memory, uint256, uint256, leaf'),
        [
           0, proof.proof, proof.numberOfLeaves, proof.leaf_index, proof.leaf
        ]
      )
    }*/
    return [
      {
        type: 'standard',
        raw: '0x'
      }
    ]
  }

  async submitData({ data }) {
    /*const keyring = new Keyring({ type: 'sr25519' })
    const account = keyring.addFromMnemonic(this.mnemonic)
    let submit = await this.client.tx.dataAvailability.submitData(data)
    let result = await sendTx(this.client, account, submit)
    const txIndex = JSON.parse(result.events[0].phase).applyExtrinsic
    const blockHash = result.status.asInBlock
    console.log(`Transaction: ${result.txHash}. Block hash: ${blockHash}. Transaction index: ${txIndex}.`)*/
    return '0x'
  }
}

export default AvailController
