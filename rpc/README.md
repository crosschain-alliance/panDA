# RPC

The main Disperser Service method:

```json
{
    "jsonrpc": "2.0",
    "method": "ds_submitData",
    "params": [
        {
            "data": "aGVsbG8gd29ybGQh",
            "pandaId": "47abc629", // id deterministically generated to create a link between for example addresses and celestia namespaces
            "das": [
                {
                    "name": "celestia"
                },
                {
                    "name": "ethereum"
                },
                {
                    "name": "gnosis"
                }
            ]
        }
    ]
}
```


The main Inclusion Proofs Collection Service method:


```json
{
    "jsonrpc": "2.0",
    "method": "ipcs_getProofs",
    "params": [
        {
            "name": "celestia",
            "verifyOn": "ethereum",
            "height": 1388892,
            "namespace": "AAAAAAAAAAAAAAAAAAAAAAAAAAECAwQFBgcICRA="
        }
    ]
}
```
