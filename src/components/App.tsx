import React, {useReducer, useState} from 'react'
import styled from '@emotion/styled'

import {programReducer, Program, evaluate, RUN, RESET} from '../modules/Program'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 1em 2.5em;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 100vh;
`

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

interface CodeProps {
  hl?: boolean
}

const focusColor = '#84ffff'

const Code = styled.code<CodeProps>`
  font-family: 'JetBrains Mono', 'FiraCode Nerd Font', 'FiraCode', monospace;
  font-size: 20px;
  line-height: 1.5;

  cursor: pointer;
  color: ${props => (props.hl ? focusColor : '#eee')};
  font-weight: ${props => (props.hl ? 'bold' : 'normal')};
`

const Input = styled.input`
  width: 100%;
  height: 100%;
  font-size: 20px;
  font-family: 'JetBrains Mono', 'FiraCode Nerd Font', 'FiraCode', monospace;
  border: 1px solid #bbb;
  border-radius: 8px;
  padding: 10px 15px;
  margin: 0.4em 0;
  background: transparent;
  outline: none;
  color: white;

  &::placeholder {
    color: white;
  }

  &:hover,
  &:active,
  &:focus {
    color: ${focusColor};
    border: 1px solid ${focusColor};

    &::placeholder {
      color: ${focusColor};
    }
  }
`

const Pre = styled.pre`
  width: 100%;
`

const Button = styled.button`
  font-size: 20px;
  font-family: 'JetBrains Mono', 'FiraCode Nerd Font', 'FiraCode', monospace;
  color: white;
  background: transparent;
  border: 1px solid #bbb;
  border-radius: 8px;
  padding: 10px 15px;
  margin: 20px 10px;
  outline: none;

  &:hover,
  &:active,
  &:focus {
    cursor: pointer;
    color: #121212;
    background: #eee;
  }
`

export function App() {
  const [state, dispatch] = useReducer(programReducer, Program())
  const [code, setCode] = useState('')
  const [irCode, setIRCode] = useState('')

  const step = () => dispatch(RUN)
  const reset = () => dispatch(RESET)

  function run() {
    dispatch({type: 'ADD', payload: code})
    step()
    setCode('')
  }

  function runIR() {
    dispatch({type: 'ASSEMBLE', payload: irCode})
    step()
    setIRCode('')
  }

  const jump = (line: number) => dispatch(evaluate(`jmp ${line}`))

  const ip = state.machine.registers.eip || 0

  return (
    <Container>
      <Panel>
        <Pre>
          {state.program.map((x, i) => (
            <div onClick={() => jump(i)}>
              <Code hl={i === ip}>
                <small>{i})</small> {x}
              </Code>
            </div>
          ))}
        </Pre>

        <Pre>
          <Code>{JSON.stringify(state.machine, null, 2)}</Code>
        </Pre>
      </Panel>

      <Panel>
        <Input
          placeholder="Assembly Code"
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && run()}
        />

        <Input
          placeholder="JS IR Code"
          value={irCode}
          onChange={e => setIRCode(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && runIR()}
        />

        <div>
          <Button onClick={step}>Step</Button>
          <Button onClick={reset}>Reset</Button>
        </div>
      </Panel>
    </Container>
  )
}
