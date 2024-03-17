# 🐼 panDA

panDA is an abstraction layer for Data Availability (DA) layers, built with additive security in mind. By using it, Layer 2 solutions and rollup ecosystems can scale efficiently and securely, leveraging different DAs as if they were one.

The fragmentation and diverse trust assumptions of the cross-chain bridging landscape has affected our industry greatly, introducing systemic risks and vendor lock-ins that in the scalability context can be avoided - panDA helps achieving that from the start, ultimately enabling a future proof L2 ecosystem.

**Key Features and Advantages:**

- **Flexibility:** panDA is created to provide seamless integration with different DA layers, and future-proofing capabilities, effectively eliminating the constraints of vendor lock-ins. This flexibility ensures that Layer 2 solutions and rollapps can adapt to the evolving landscape of Data Availability without being locked to specific platforms. If a new innovative DA gets invented your L2 can use it by simply changing the panDA configuration, with no additional changes required.
- **Redundancy:** panDA offers redundancy, giving the option to replicate data across multiple DA layers. This strategy mitigates the liveness risks associated with individual DAs, ensuring uninterrupted access and reliability when it matter the most.
- **Additive Security:** Drawing inspiration from the Hashi approach of additive security, panDA provides a robust framework for verifying data commitments across different chains. It is much safer than traditional solution as a bridging stack for propagating your state across chains.
- **Efficiency:** The platform allows to easily swap between DA layers, letting users  modifying their panDA configuration in response to changing network conditions. This dynamic adaptability optimizes resource utilization, for example in case of network congestion.

## Architecture

panDA consists of three main components:

- the Dispersion Service (`rpc/` folder) which allows for the submission of the same data on different DA layers (namely Ethereum, Gnosis, Avail DA and Celestia)
- the Inclusion Proofs Collection Service (`rpc/` folder) which generates for specific blockchains different types of proofs that demonstrate the submission of data on the selected DA layers
- the library which allows for the verification of a set of DA Inclusion Proofs (`contracts/` folder) on a given chain; some example Inclusion Proof Adapters (IPAs) are provided (`contracts/contracts/adapters/` folder).

Additionally, a demo ui is provided, to better showcase the principles the project is built on and how a multistep verification based on the above would look like (`ui/` folder).
