import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import './styles/index.css'
import { Router } from 'react-router-dom'
import history from './history'
import stores from './store/index'
import { Provider } from 'mobx-react'

Promise.almost = r => Promise.all(r.map(p => (p.catch ? p.catch(e => e) : p)))

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
