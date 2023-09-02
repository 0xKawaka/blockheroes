import './App.css'
import ServerHandler from './Classes/ServerHandler'
import Game from './Pages/Game'
import { HashRouter as Router, Route, Link, Routes } from 'react-router-dom'

function App() {

  let serverHandler = new ServerHandler()

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Game serverHandler={serverHandler} />} />
        </Routes>
    </Router>
  )
}

export default App