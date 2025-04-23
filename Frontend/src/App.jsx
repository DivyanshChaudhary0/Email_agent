import './App.css'
import AppRoutes from './Routes/AppRoutes'
import {GoogleOAuthProvider} from "@react-oauth/google"

function App() {

  return (
    <>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AppRoutes/>
    </GoogleOAuthProvider>
    </>
  )
}

export default App
