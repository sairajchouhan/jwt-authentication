import React from 'react'
import ReactDOM from 'react-dom'
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

import App from './App'
import jwtDecode from 'jwt-decode'
// import { TokenRefreshLink } from 'apollo-link-token-refresh'
// import jwtDecode from 'jwt-decode'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
})

const backgroundAccessTokenRefresh = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('at')
  if (!token) {
    return forward(operation)
  }
  const { exp }: any = jwtDecode(token)
  if (Date.now() >= exp * 1000) {
    return forward(operation)
  }

  fetch('http://localhost:4000/refresh_token', {
    method: 'POST',
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem('at', data.accessToken)
    })
    .catch((err) => {
      console.log(err)
      return forward(operation)
    })

  return forward(operation)
})

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: `Bearer ${localStorage.getItem('at')}`,
    },
  })
  return forward(operation)
})

const client = new ApolloClient({
  link: from([authMiddleware, backgroundAccessTokenRefresh, httpLink]),
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
