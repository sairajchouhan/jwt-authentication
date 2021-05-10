import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { useRegisterMutation } from '../generated/graphql'

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [register] = useRegisterMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await register({ variables: { email, password } })
      setEmail('')
      setPassword('')
      history.push('/')
      console.log(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <h1>Register</h1>
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
export default Register
