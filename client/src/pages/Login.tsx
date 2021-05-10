import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useLoginMutation } from '../generated/graphql'

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const history = useHistory()
  const [email, setEmail] = useState('sairaj2119@gmail.com')
  const [password, setPassword] = useState('aunzbedi')
  const [login] = useLoginMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await login({ variables: { email, password } })
      localStorage.setItem('at', res.data?.login.accessToken as any)
      setEmail('')
      setPassword('')
      history.push('/')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
export default Login
