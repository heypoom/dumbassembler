import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'

import {mTurk, listTaskResults, getTask, getTaskAnswer} from './skynet/MTurk'
import {createHumanTaskFromCode} from './skynet/MTurkTask'

import {App} from './components/App'

window.mTurk = mTurk
window.getTask = getTask
window.listTaskResults = listTaskResults
window.getTaskAnswer = getTaskAnswer
window.createHumanTaskFromCode = createHumanTaskFromCode

ReactDOM.render(<App />, document.querySelector('#app'))
