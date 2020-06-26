import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'

import {mTurk} from './skynet/MTurk'

import {App} from './components/App'

window.mTurk = mTurk

ReactDOM.render(<App />, document.querySelector('#app'))
