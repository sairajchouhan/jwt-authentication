import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './Header'
import Bye from './pages/Bye'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/bye" exact component={Bye} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
