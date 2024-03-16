import React, { useCallback, useMemo, useState } from 'react'
import axios from 'axios'

import sleep from './utils/sleep'

const App = () => {
  const [data, setData] = useState('')
  const [selectedDas, setSelectedDas] = useState({
    avail: false,
    celestia: false,
    ethereum: false,
    gnosis: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState({
    avail: false,
    celestia: false,
    ethereum: false,
    gnosis: false
  })

  const onSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true)
      const das = []
      if (selectedDas.ethereum) {
        das.push({
          name: 'ethereum',
          address: '0xff00000000000000000000000000000000000001'
        })
      }
      if (selectedDas.gnosis) {
        das.push({
          name: 'gnosis',
          address: '0xff00000000000000000000000000000000000001'
        })
      }
      if (selectedDas.celestia) {
        das.push({
          name: 'celestia',
          namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAECAwQFBgcICRA='
        })
      }
      if (selectedDas.avail) {
        das.push({
          name: 'avail'
        })
      }

      const { data: response } = await axios.post('http://127.0.0.1:3000/v1', {
        id: 1,
        jsonrpc: '2.0',
        method: 'ds_submitData',
        params: [Buffer.from(data).toString('base64'), das]
      })
      setIsSubmitting(false)
      setSubmitted(true)
      setIsVerifying(true)

      const proofsData = response.result.map(({ name, data }) => {
        const res = { name }
        if (name === 'celestia')
          return {
            ...res,
            height: data,
            namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAECAwQFBgcICRA='
          }
        return res
      })

      while (true) {
        const { data: res } = await axios.post('http://127.0.0.1:3000/v1', {
          jsonrpc: '2.0',
          method: 'ipcs_getProofs',
          params: [Buffer.from(data).toString('base64'), 'ethereum', proofsData]
        })

        for (const { name } of res.result) {
          setStatus((_status) => ({ ..._status, [name]: true }))
        }

        if (res.result.length === das.length) break
        await sleep(500)
      }
    } catch (_err) {
      console.error(_err)
    } finally {
      setIsSubmitting(false)
      setIsVerifying(false)
    }
  }, [data, selectedDas])

  const hasSelectedAtLeastOneDa = useMemo(() => Object.values(selectedDas).includes(true), [selectedDas])
  const submitDisabled = useMemo(
    () => !hasSelectedAtLeastOneDa || isSubmitting || submitted,
    [hasSelectedAtLeastOneDa, isSubmitting, submitted]
  )

  const completed = useMemo(
    () =>
      Object.values(status).filter((_val) => _val).length === Object.values(selectedDas).filter((_val) => _val).length,
    [status, selectedDas]
  )

  return (
    <React.Fragment>
      <nav className="bg-white p-4">
        <div className="mx-auto flex justify-center items-center">
          <div className="flex items-center justify-center">
            <img src="./favicon.ico" width={72} height={72} alt="logo" />
          </div>
        </div>
      </nav>
      <div className="flex-grow items-center justify-center max-w-3xl mx-auto mt-16 md:mt-24 ">
        <div>
          <input
            className={`p-4 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full`}
            value={data}
            placeholder="Data to submit"
            onChange={(_e) => setData(_e.target.value)}
          />
          <div className="flex justify-between mt-4">
            <div className="flex items-end">
              <div className="flex">
                <input
                  type="checkbox"
                  id="sepoliaCheckbox"
                  className="hidden peer"
                  value={selectedDas.ethereum}
                  onChange={() =>
                    setSelectedDas({
                      ...selectedDas,
                      ethereum: !selectedDas.ethereum
                    })
                  }
                />
                <label
                  htmlFor="sepoliaCheckbox"
                  className="block w-6 h-6 bg-white border border-gray-200 rounded-md cursor-pointer peer-checked:bg-purple-500"
                ></label>
                <label htmlFor="sepoliaCheckbox" className="select-none cursor-pointer ml-2">
                  Ethereum
                </label>
              </div>

              <div className="flex ml-5">
                <input
                  type="checkbox"
                  id="celestiaCheckbox"
                  className="hidden peer"
                  value={selectedDas.celestia}
                  onChange={() =>
                    setSelectedDas({
                      ...selectedDas,
                      celestia: !selectedDas.celestia
                    })
                  }
                />
                <label
                  htmlFor="celestiaCheckbox"
                  className="block w-6 h-6 bg-white border border-gray-200 rounded-md cursor-pointer peer-checked:bg-purple-500"
                ></label>
                <label htmlFor="celestiaCheckbox" className="select-none cursor-pointer ml-2">
                  Celestia
                </label>
              </div>

              <div className="flex ml-5">
                <input
                  type="checkbox"
                  id="availCheckbox"
                  className="hidden peer"
                  value={selectedDas.avail}
                  onChange={() =>
                    setSelectedDas({
                      ...selectedDas,
                      avail: !selectedDas.avail
                    })
                  }
                />
                <label
                  htmlFor="availCheckbox"
                  className="block w-6 h-6 bg-white border border-gray-200 rounded-md cursor-pointer peer-checked:bg-purple-500"
                ></label>
                <label htmlFor="availCheckbox" className="select-none cursor-pointer ml-2">
                  Avail
                </label>
              </div>

              <div className="flex ml-5">
                <input
                  type="checkbox"
                  id="gnosisCheckbox"
                  className="hidden peer"
                  value={selectedDas.gnosis}
                  onChange={() =>
                    setSelectedDas({
                      ...selectedDas,
                      gnosis: !selectedDas.gnosis
                    })
                  }
                />
                <label
                  htmlFor="gnosisCheckbox"
                  className="block w-6 h-6 bg-white border border-gray-200 rounded-md cursor-pointer peer-checked:bg-purple-500"
                ></label>
                <label htmlFor="gnosisCheckbox" className="select-none cursor-pointer ml-2">
                  Gnosis
                </label>
              </div>
            </div>
            <button
              className={`bg-purple-500 text-white font-bold py-3 px-12 rounded-lg hover:bg-purple-700 disabled:bg-purple-300 w-42 h-12 items-center justify-center flex`}
              onClick={onSubmit}
              disabled={submitDisabled}
            >
              {isSubmitting ? <div className="spinner" /> : submitted ? 'Submitted' : 'Submit'}
            </button>
          </div>

          {hasSelectedAtLeastOneDa && submitted && (
            <React.Fragment>
              <div className="border border-gray-200 mt-16 rounded-lg">
                <div className={`px-2 py-5 flex ${completed ? ' bg-green-100' : ''} rounded-t-lg`}>
                  <div className="flex flex-col justify-center items-center w-24">
                    <img src="./assets/png/eth.png" width={24} height={24} alt="eth" />
                    <span className="mt-2 text-sm">Ethereum</span>
                  </div>
                  <div className="flex flex-col ml-8 justify-between w-full">
                    <div className="flex h-full w-full">
                      {selectedDas.ethereum && (
                        <div
                          className={`border border-gray-200 ${
                            status.ethereum ? 'bg-green-300' : ''
                          } rounded mr-2 w-full text-xs flex items-center justify-center`}
                        >
                          Local (EIP-4844)
                        </div>
                      )}
                      {selectedDas.celestia && (
                        <div
                          className={`border border-gray-200 ${
                            status.celestia ? 'bg-green-300' : ''
                          } rounded mr-2 w-full text-xs flex items-center justify-center`}
                        >
                          Celestia
                        </div>
                      )}
                      {selectedDas.avail && (
                        <div
                          className={`border border-gray-200 ${
                            status.avail ? 'bg-green-300' : ''
                          } rounded mr-2 w-full text-xs flex items-center justify-center`}
                        >
                          Avail
                        </div>
                      )}
                      {selectedDas.gnosis && (
                        <div
                          className={`border border-gray-200 ${
                            status.gnosis ? 'bg-green-300' : ''
                          } rounded mr-2 w-full text-xs flex items-center justify-center`}
                        >
                          Gnosis (EIP-4844)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedDas.gnosis && (
                  <div className="px-2 py-5 flex border-t border-gray-200">
                    <div className="flex flex-col justify-center items-center w-24">
                      <img src="./assets/png/gnosis.png" width={34} height={34} alt="gnosis" />
                      <span className="mt-2 text-sm">Gnosis</span>
                    </div>
                    <div className="flex flex-col ml-8 justify-between w-full">
                      <div className="flex h-full w-full">
                        {selectedDas.ethereum && (
                          <React.Fragment>
                            <div
                              className={`border border-gray-200 ${
                                status.gnosis ? 'bg-green-300' : ''
                              }  rounded mr-2 w-full text-xs flex items-center justify-center`}
                            >
                              Local (EIP-4844)
                            </div>
                            <div
                              className={`border border-gray-200 rounded mr-2 w-full text-xs flex items-center justify-center`}
                            >
                              Celestia
                            </div>
                            <div
                              className={`border border-gray-200 rounded mr-2 w-full text-xs flex items-center justify-center`}
                            >
                              Avail
                            </div>
                            <div
                              className={`border border-gray-200 rounded mr-2 w-full text-xs flex items-center justify-center`}
                            >
                              Ethereum (EIP-4844)
                            </div>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          )}
        </div>
        {isVerifying && !completed && <div className="loading-bar rounded-lg mt-12 border border-gray-200" />}
      </div>
    </React.Fragment>
  )
}

export default App
