import React, {useState, useEffect} from 'react'
import styled from '@emotion/styled'

import {createHumanTaskFromCode} from '../skynet/MTurkTask'
import {HIT} from 'aws-sdk/clients/mturk'
import {getBalance} from '../skynet/MTurk'

interface Props {
  path: string
}

const focusColor = '#84ffff'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 1em 2.5em;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 100vh;
`

const Textarea = styled.textarea`
  width: 100%;
  height: 100%;
  font-size: 24px;
  font-family: 'JetBrains Mono', 'FiraCode Nerd Font', 'FiraCode', monospace;
  line-height: 1.4;
  border: 1px solid #bbb;
  border-radius: 8px;
  padding: 10px 15px;
  margin: 0.4em 0;
  background: transparent;
  outline: none;
  color: white;
  height: 500px;

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

const Pre = styled.pre`
  width: 100%;
`

const Code = styled.code`
  font-family: 'JetBrains Mono', 'FiraCode Nerd Font', 'FiraCode', monospace;
  font-size: 20px;
  line-height: 1.5;

  cursor: pointer;
  color: #eee;
`

export function PublishTaskPage(props: Props) {
  const [task, setTask] = useState<HIT>()
  const [code, setCode] = useState('')
  const [balance, setBalance] = useState('0.00')

  async function publishTask() {
    const hit = await createHumanTaskFromCode(code)

    if (hit) setTask(hit)
  }

  useEffect(() => {
    getBalance().then(balance => balance && setBalance(balance))
  }, [task])

  return (
    <Container>
      <div style={{marginBottom: '1em'}}>
        Account Balance: <strong>{balance}$</strong>
      </div>

      {task && (
        <Pre>
          <Code>{JSON.stringify(task, null, 2)}</Code>
        </Pre>
      )}

      <Textarea value={code} onChange={e => setCode(e.target.value)} />
      <Button onClick={publishTask}>Create Human Labor Task</Button>
    </Container>
  )
}
