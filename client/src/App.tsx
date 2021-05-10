import { useHelloQuery } from './generated/graphql'

const App = () => {
  const { data, loading, error } = useHelloQuery()

  if (loading || !data) return <h1>Loading....</h1>
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
      <h1>{data.hello}</h1>
    </div>
  )
}

export default App
