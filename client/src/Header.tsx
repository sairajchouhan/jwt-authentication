import React from 'react'
import { Link } from 'react-router-dom'
import { useMeQuery } from './generated/graphql'

interface headerProps {}

const Header: React.FC<headerProps> = () => {
  const { data, loading } = useMeQuery({ fetchPolicy: 'network-only' })

  let body: any = null
  if (loading) {
    body = null
  } else if (data && data.me) {
    body = <div>You are logged in as {data.me.email}</div>
  } else {
    body = <div>You are not logged in</div>
  }

  return (
    <div>
      <header>
        <ul
          style={{
            display: 'flex',
            listStyle: 'none',
            width: '20vw',
            justifyContent: 'space-between',
          }}
        >
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/bye">Bye</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
        {body}
      </header>
    </div>
  )
}
export default Header
