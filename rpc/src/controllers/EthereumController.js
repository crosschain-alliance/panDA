import { BlobUploader, EncodeBlobs } from 'ethstorage-sdk'
import { createPublicClient, http, encodeAbiParameters, parseAbiParameters } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import pkg from 'c-kzg'
const { BYTES_PER_BLOB, computeBlobKzgProof, blobToKzgCommitment, verifyBlobKzgProofBatch } = pkg

class EthereumController {
  constructor({ rpcUrl, privateKey, chain }) {
    this.publicClient = createPublicClient({
      chain,
      transport: http()
    })
    this.uploader = new BlobUploader(rpcUrl, privateKey)
    this._address = privateKeyToAccount(privateKey)
  }

  async getProof({ verifyOn }) {
    if (verifyOn === 'ethereum') {
      // TODO: get blob by pandaId
      const blob = Buffer.alloc(BYTES_PER_BLOB, '*')
      const commitment = blobToKzgCommitment(blob)
      const proof = computeBlobKzgProof(blob, commitment)
      if (!verifyBlobKzgProofBatch([blob], [commitment], [proof])) throw new Error('Proof verification failed')
      // TODO: encode abi (bytes32 blobHash, uint256 x, uint256 y, bytes1[48] memory commitment, bytes1[48] memory proof)
      return [
        {
          type: 'kzgproof',
          raw: '0x'
        }
      ]
    }
  }

  async submitBlob({ address, content, data = '0x', value = 0, maxFeePerGas, maxPriorityFeePerGas, maxFeePerBlobGas }) {
    const tx = {
      to: address,
      data,
      value: BigInt(value),
      nonce: BigInt(await this.publicClient.getTransactionCount(this._address)),
      maxFeePerGas,
      maxPriorityFeePerGas,
      maxFeePerBlobGas
    }

    const buffer = Buffer.from(content, 'base64')
    const blobs = EncodeBlobs(buffer)

    return await this.uploader.sendTx(tx, blobs)
  }
}

export default EthereumController
