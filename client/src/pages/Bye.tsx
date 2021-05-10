import React from 'react'
import { useByeQuery } from '../generated/graphql'

interface ByeProps {}

const Bye: React.FC<ByeProps> = () => {
  const { data, loading, error } = useByeQuery({ fetchPolicy: 'network-only' })

  if (error) {
    console.log(error)
    return <div>error</div>
  }

  if (loading || !data) {
    return <div>Loading...</div>
  }

  return <div>{data.bye}</div>
}
export default Bye
