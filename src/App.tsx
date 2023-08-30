import { useEffect, useState } from 'react'

import './App.css'
import { proxy, useSnapshot } from 'valtio'

const state = proxy({ count: 0, text: 'hello' })

//@ts-ignore
window.vState = state

const Updater = () => {
  const onClick = () => {
    ++state.count

    //@ts-ignore
    const event = new CustomEvent("build", { detail: state});

    window.dispatchEvent(event);
  }
  return <button onClick={onClick}>+1</button>
}

const DisplayCount = () => {
  const snap = useSnapshot(state)

  return <div>{snap.count}</div>
}

// access state without using useSnapshot

const AccessState = () => {
 //@ts-ignore
  const [count, setCount] = useState(window.vState.count)

  const handler = (e: any) => setCount(e.detail.count)

  useEffect(() => {
    window.addEventListener('build', handler)

    return () => window.removeEventListener('build', handler)
  },[handler])


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
