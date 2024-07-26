import React, { useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter, Routes , Route, Navigate } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'

const PrivateRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAutheticated = !!userInfo;
  return isAutheticated ? children : <Navigate to = "/auth" />;
}

const AuthRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAutheticated = !!userInfo;
  return isAutheticated ? <Navigate to = "/chat" /> : children;
}

const App = () => {
  const {userInfo , setUserInfo} = useAppStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO);
        console.log({response});
        if(response.status === 200 && response.data.id){
          setUserInfo(response.data)
        }
        else{
          setUserInfo(undefined)
        }
      }
      catch(error){
          setUserInfo(undefined)
      }
      finally{
          setLoading(false);
      }
    }
    if(!userInfo){
      getUserData();
    }
    else{
      setLoading(false);
    }
  },[userInfo , setUserInfo]);

  if(loading){
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
    <Routes>
       <Route path ="/auth" element = {<AuthRoute> <Auth /> </AuthRoute>}/>
       <Route path ="/chat" element = {<PrivateRoute> <Chat /> </PrivateRoute>}/>
       <Route path ="/profile" element = { <PrivateRoute> <Profile/> </PrivateRoute>}/>
       <Route path ="*" element = {<Navigate to = "/auth"/>} />
    </Routes>
    </BrowserRouter>
  );
};

export default App