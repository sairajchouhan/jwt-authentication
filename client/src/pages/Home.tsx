import React from 'react'
import { useUsersQuery } from '../generated/graphql'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const { data, loading } = useUsersQuery({ fetchPolicy: 'network-only' })

  if (loading || !data) return <h1>Loading...</h1>

  return (
    <div>
      {data.users.map((user) => (
        <h1 key={user.id}>{user.email}</h1>
      ))}
    </div>
  )
}
export default Home
