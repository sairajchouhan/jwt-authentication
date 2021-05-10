import React from 'react'
import ReactDOM from 'react-dom'
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  concat,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

import App from './App'

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' })
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: `Bearer ${localStorage.getItem('at')}`,
    },
  })

  return forward(operation)
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  credentials: 'include',
  link: concat(authMiddleware, httpLink),
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
