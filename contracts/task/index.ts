import { task } from "hardhat/config"

task("Panda:deploy").setAction(async (_args, _hre) => {
  console.log("Deploying Panda...")
  const Panda = await _hre.ethers.getContractFactory("Panda")
  const panda = await Panda.deploy(_args.blobstreamX)
  console.log("Panda deployed to:", await panda.getAddress())
})

task("BlobStreamXAdapter:deploy").setAction(async (_args, _hre) => {
  console.log("Deploying BlobStreamXAdapter...")
  const BlobStreamXAdapter = await _hre.ethers.getContractFactory("BlobStreamXAdapter")
  const blobStreamXAdapter = await BlobStreamXAdapter.deploy(_args.blobstreamX)
  console.log("BlobStreamXAdapter deployed to:", await blobStreamXAdapter.getAddress())
})

task("Adapter4844:deploy").setAction(async (_args, _hre) => {
  console.log("Deploying Adapter4844...")
  const Adapter4844 = await _hre.ethers.getContractFactory("Adapter4844")
  const adapter4844 = await Adapter4844.deploy(_args.blobstreamX)
  console.log("Adapter4844 deployed to:", await adapter4844.getAddress())
})
