import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home, Create_Join, Chat_Container } from '../Pages'
import { SocketProvider } from '../Provider/SocketContext'
import { StateProvider } from '../Provider/StateContext'
import "./App.css"

function App() {

  return (
    <>
      <StateProvider>
        <SocketProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/action/:type' element={<Create_Join />} />
              <Route path='/room/:name/:room/:roomid' element={<Chat_Container />} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </StateProvider>
    </>
  )
}

export default App
