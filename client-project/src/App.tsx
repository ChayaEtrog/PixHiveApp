import { useReducer } from 'react'
import './App.css'
import UserReducer, { emptyUser, UserContext } from './components/user/UserReducer'
import { router } from './Router'
import { RouterProvider } from 'react-router'

function App() {
  const [user, userDispatch] = useReducer(UserReducer, emptyUser)
  
  return (
    <>
       <UserContext value={{ user, userDispatch }}>
          <RouterProvider router={router} />
      </UserContext>
    </>
  )
}

export default App
