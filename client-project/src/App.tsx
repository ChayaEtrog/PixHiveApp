import { useEffect, useReducer } from 'react'
import './App.css'
import UserReducer, { emptyUser, UserContext } from './components/user/UserReducer'
import { router } from './Router'
import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import store from './components/appStore'

function App() {
  const [user, userDispatch] = useReducer(UserReducer, emptyUser);

  useEffect(() => {
    const loadUserData = () => {
      const userData = sessionStorage.getItem('user');
      if (userData) {
        userDispatch({ type: 'CREATE_USER', data: JSON.parse(userData) });
      }
    };

    loadUserData();
  }, [userDispatch]);

  return (
    <UserContext.Provider value={{ user, userDispatch }}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </UserContext.Provider>
  );
}

export default App
