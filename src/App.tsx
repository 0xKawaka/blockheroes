import './App.css'
import ServerHandler from './Classes/IO/ServerHandler'
import Game from './Pages/Game'
import { HashRouter as Router, Route, Link, Routes } from 'react-router-dom'
import GamePage from './Pages/GamePage'

type AppProps = {
  serverHandler: ServerHandler
}

function App({serverHandler} : AppProps) {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Game serverHandler={serverHandler} />} />
          <Route path="/game" element={<GamePage serverHandler={serverHandler} />} />
          {/* <Route path="/battleSelect" element={<BattlesSelect battlesList={worldsBattlesList['world1']} heroesList={heroesList} serverHandler={serverHandler} />}/>
          <Route path="/myHeroes" element={<MyHeroes serverHandler={serverHandler} heroesList={heroesList} runesList={runesList} baseStatsDict={baseStatsDict}/>}/> */}
        </Routes>
    </Router>
  )
}

export default App