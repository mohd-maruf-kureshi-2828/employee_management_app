import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { CRUD } from './components/CRUD'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <CRUD/>
    </>
  )
}

export default App
