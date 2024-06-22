import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { useEffect } from 'react'
import ButtonAppBar from './components/AppBar'
import { Homepage } from './pages/Homepage'
import { Search } from './pages/Search'
import { Wishlist } from './pages/Wishlist'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useSetRecoilState } from 'recoil'
import { userAtom } from './store/atoms/atoms'
import MyPicks from './pages/MyPicks'
import { TOKEN_NAME } from './constants/constants'
import axios from 'axios'

function App() {
  const setUser = useSetRecoilState(userAtom)

  useEffect(() => {
    console.log("loading app.jsx page")

    const fetchIsEditorFlag = async () => {
      try {
        if(localStorage.getItem(TOKEN_NAME)) {
          console.log("fetching isEditor")
          const res = await axios.get("http://localhost:3000/api/v1/user/", {
              headers: {
                'Authorization': "Bearer "+localStorage.getItem(TOKEN_NAME)
            }}
          )
    
          console.log(`isEditor api call response: ${res}`)
    
          setUser({
            token: localStorage.getItem(TOKEN_NAME),
            isEditor: res.data.isEditor
          })
        }
      } catch(err) {
        console.log(err.response.data.message)
      }
    }

    fetchIsEditorFlag();
  }, [])

  return (
    <BrowserRouter>
      <ButtonAppBar />
      <div style={{ marginTop: '140px', flexGrow: 1, overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/my-picks" element={<MyPicks />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
