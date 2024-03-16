const sleep = (_ms, _res = null) =>
  new Promise((_resolve) =>
    setTimeout(() => {
      _resolve(_res)
    }, _ms)
  )

export default sleep
