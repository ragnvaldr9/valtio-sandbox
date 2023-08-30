import { useEffect, useState } from 'react'

import './App.css'
import { proxy, useSnapshot } from 'valtio'
import { subscribeKey } from 'valtio/utils'

const state = proxy({ count: 0, text: 'hello' })

class StateWrapper {
  constructor(state: any) {
    //@ts-ignore
    this.state = state
  }

  subscribeKey = (k: any, cb: any) => {
    //@ts-ignore
    subscribeKey(this.state, k, (v) => {
      cb(v)
    })
  }

  getValue = (k: any) => {
    //@ts-ignore
    return this.state[k]
  }
}


//@ts-ignore
window.vState = new StateWrapper(state)

const Updater = () => {
  return <button onClick={() => ++state.count}>+1</button>
}

const DisplayCount = () => {
  const snap = useSnapshot(state)

  return <div>{snap.count}</div>
}

// access state without using useSnapshot, can be use in microfrontends

const useExternalState = (k: any) => {
  //@ts-ignore
  const [value, setValue] = useState(window.vState.getValue(k))

  useEffect(() => {
    //@ts-ignore
    window.vState.subscribeKey(k, setValue)
  },[])
  
  return value
}


const AccessState = () => {
 //@ts-ignore
  const count = useExternalState('count')

  return <div>{count}</div>
}

function App() {
  return (
    <>
      <Updater />
      <DisplayCount />
      <AccessState />
    </>
  )
}

export default App
