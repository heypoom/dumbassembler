import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'

import {mTurk} from './skynet/MTurk'
import {createHumanTaskFromCode} from './skynet/MTurkTask'

import {App} from './components/App'

window.mTurk = mTurk
window.createHumanTaskFromCode = createHumanTaskFromCode

ReactDOM.render(<App />, document.querySelector('#app'))
