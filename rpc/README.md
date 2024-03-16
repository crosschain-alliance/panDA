# RPC


```json
{
    "jsonrpc": "2.0",
    "method": "panda.submitBlob",
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


```json
{
    "jsonrpc": "2.0",
    "method": "panda.getProof",
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