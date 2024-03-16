# 🐼 panDA

panDA introduces an innovative abstraction layer designed for Data Availability (DA) layers. It has been designed to empower Layer 2 solutions and rollapp ecosystems, enabling them to scale efficiently and securely while maintaining complete peace of mind. 
The core mission of panDA is to address the current scalability challenges faced by blockchain networks, ensuring that they are equipped to handle the demands of future growth.

**Key Features and Advantages:**

- **Flexibility:** panDA is crafted to provide seamless integration and future-proofing capabilities, effectively eliminating the constraints of vendor lock-ins. This flexibility ensures that Layer 2 solutions and rollapps can adapt to the evolving landscape of Data Availability without being locked to specific platforms.
- **Efficiency:** The platform allows to easily swap between DA layers, letting users  modifying their panDA configuration in response to changing network conditions. This dynamic adaptability optimizes resource utilization, for example in case of network congestion.
- **Redundancy:** panDA offers redundancy, giving the option to replicate data across multiple DA layers. This strategy mitigates the risks associated with the dependency on the liveness of any single DA, ensuring uninterrupted access and reliability.
- **Additive Security:** Drawing inspiration from the Hashi additive approach, panDA provides a robust framework for verifying data commitments across different chains.

## Architecture

panDA consists of three main components:

- the Dispersion Service (`rpc/` folder) which allows for the submission of the same data on different DA layers (namely Ethereum, Gnosis, Avail DA and Celestia)
- the Inclusion Proofs Collection Service (`rpc/` folder) which generates for specific blockchains different types of proofs that demonstrate the submission of data on the selected DA layers
- the library which allows for the verification of a set of DA Inclusion Proofs (`contracts/` folder) on a given chain; some example Inclusion Proof Adapters (IPAs) are provided (`contracts/contracts/adapters/` folder).

Additionally, a demo ui is provided, to better showcase the principles the project is built on and how a multistep verification based on the above would look like (`ui/` folder).
