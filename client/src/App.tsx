import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
  return (
    <BrowserRouter>
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
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </header>
      </div>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" exact component={Register} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
