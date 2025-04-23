
import { useGoogleLogin } from '@react-oauth/google'
import React from 'react'

const Auth = () => {

    const login = useGoogleLogin({
        onSuccess: (data) => { console.log(data) },
        onError: () => {},
        flow: 'auth-code',
        scope: "https://mail.google.com/ https://www.googleapis.com/auth/calendar profile email openid"
    })
     

  return (
    <div>
        <button onClick={login}>Continue with google</button>
    </div>
  )
}

export default Auth