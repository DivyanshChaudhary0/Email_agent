
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import React from 'react'

const Auth = () => {

    const login = useGoogleLogin({
        onSuccess: (response) => {
          const { code } = response
            alert('Login successful')
            try {
                axios.get(`http://localhost:3000/api/auth/google/callback?code=${code}`)
                .then((res) => {
                    console.log(res)
                })
                .catch((err)=>{
                  console.log(err);
                })
            } catch (error) {
                console.error('Error during login:', error);
            }
        },
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