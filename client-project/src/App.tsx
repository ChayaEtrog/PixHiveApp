import { useEffect, useReducer } from 'react'
import './App.css'
import UserReducer, { emptyUser, UserContext } from './components/user/UserReducer'
import { router } from './Router'
import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import store from './components/appStore'
import { createTheme, ThemeProvider } from '@mui/material'

function App() {
  const [user, userDispatch] = useReducer(UserReducer, emptyUser);
  const theme = createTheme({
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            '& fieldset': {
              borderRadius: '12px',
              border: '2px solid',
              borderImageSlice: 1,
              borderImageSource: 'linear-gradient(to right, #47dcd1, #dc8dec)',
            },
            '&.Mui-focused fieldset': {
              backgroundColor: 'none',
              borderImageSource: 'linear-gradient(to right, #47dcd1, #dc8dec)',
            },
          },
      
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: 'gray',
            '&.Mui-focused': {
              color: 'rgb(0, 215, 215)',
            },
          },
        },
      }
    },
  });

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
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ user, userDispatch }}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App
