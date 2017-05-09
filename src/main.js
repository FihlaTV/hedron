import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { Router } from 'react-router'
import history from './history'
import { composeWithDevTools } from 'remote-redux-devtools'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './store/rootSaga'
import rootReducer from './store/rootReducer'
import App from './components/App'
import Engine from './Engine'
import Stats from 'stats.js'
import './windows'
import 'react-select/dist/react-select.css'
import './style.css'

// inputs
import initiateAudio from './inputs/AudioInput'
import initiateMidi from './inputs/MidiInput'
import initiateGeneratedClock from './inputs/GeneratedClock'

import { AppContainer } from 'react-hot-loader'

const stats = new Stats()
stats.dom.setAttribute('style', '')

const composeEnhancers = composeWithDevTools({
  realtime: true,
  actionsBlacklist: [
    'CLOCK_PULSE', 'CLOCK_BEAT_INC', 'CLOCK_BPM_UPDATE', 'INPUT_FIRED',
    'NODE_VALUE_UPDATE', 'NODE_SHOT_ARM', 'NODE_SHOT_DISARM'
  ]
})

const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(sagaMiddleware)
))

sagaMiddleware.run(rootSaga)

const renderApp = (Component) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <Router history={history}>
          <App stats={stats} />
        </Router>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}

renderApp(App)

// Hot Module Replacement API
if (module.hot) module.hot.accept('./components/App', () => renderApp(App))

initiateAudio(store)
initiateMidi(store)
initiateGeneratedClock(store)
Engine.run(store, stats)
