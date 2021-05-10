import { gql, useQuery } from '@apollo/client'

const App = () => {
  const { data, loading, error } = useQuery(gql`
    query Hello {
      hello
    }
  `)

  if (loading) return <h1>Loading....</h1>
  if (error) {
    return (
      <div>
        <h1>{error.name}</h1>
        <h1>{error.message}</h1>
      </div>
    )
  }

  console.log(data)

  return (
    <div>
      <h1>{JSON.stringify(data)}</h1>
    </div>
  )
}

export default App
