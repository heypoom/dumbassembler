import React from 'react'
import {Router} from '@reach/router'

import {InterpreterPage} from '../routes/Interpreter'
import {PublishTaskPage} from '../routes/PublishTask'

export function App() {
  return (
    <Router>
      <PublishTaskPage path="/" />
      <InterpreterPage path="/interpreter" />
    </Router>
  )
}
