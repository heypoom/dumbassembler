import React, {useState, useEffect} from 'react'
import styled from '@emotion/styled'

import {createHumanTaskFromCode} from '../skynet/MTurkTask'
import {HIT} from 'aws-sdk/clients/mturk'
import {getBalance, getTaskAnswer, getTask} from '../skynet/MTurk'
import {
  getStore,
  defaultStoreState,
  Store,
  Task,
  TaskAnswer,
  getTaskResult,
} from '../skynet/Persist'

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
  padding: 4px 8px;
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

const TaskItemContainer = styled.div`
  font-size: 20px;
  line-height: 1.5;

  border: 1px solid #eee;
  border-radius: 8px;
`

const TaskItemInner = styled.div`
  padding: 10px 20px;
`

const TaskTitle = styled.div`
  background: #eee;
  border-radius: 4px 4px 0px 0px;
  color: #121212;
  padding: 0.2em 0.8em;
  font-size: 0.9em;
`

interface TaskListProps {
  tasks: Store['tasks']
}

function sortAnswer(answer: TaskAnswer[]) {
  return answer.sort((a, b) => {
    const $a = Number(a.instruction.split('_')[0])
    const $b = Number(b.instruction.split('_')[0])

    return $a - $b
  })
}

function HumanAnswer({taskId}: {taskId: string}) {
  const [answer, setAnswer] = useState<TaskAnswer[]>()

  async function fetchAnswer() {
    const result = getTaskResult(taskId)
    if (result.length > 0) return setAnswer(result)

    const answers = await getTaskAnswer(taskId)
    if (!answers) return

    const [{answer}] = answers
    setAnswer(answer)
  }

  useEffect(() => {
    fetchAnswer().then()
  }, [taskId])

  return (
    <div>
      <Pre>
        {answer &&
          sortAnswer(answer).map(ans => (
            <div>
              <Code>
                {ans.instruction.replace(/_/g, ' ')} => {ans.result}
              </Code>
            </div>
          ))}
      </Pre>

      <Button onClick={fetchAnswer}>Refresh</Button>
    </div>
  )
}

function TaskItem(props: Task) {
  const {task, inputCode} = props

  const [isShowXML, setShowXML] = useState(false)
  const [isShowCode, setShowCode] = useState(false)
  const [isShowAnswer, setShowAnswer] = useState(false)

  return (
    <TaskItemContainer>
      <TaskTitle>Task ID: {task.HITId}</TaskTitle>

      <TaskItemInner>
        <div>
          XML Question Payload:{' '}
          <Button onClick={() => setShowXML(!isShowXML)}>
            {isShowXML ? 'Hide' : 'Show'}
          </Button>
          {isShowXML && (
            <Pre>
              <Code style={{fontSize: 13}}>{task.Question}</Code>
            </Pre>
          )}
        </div>

        <div>
          Assembly Code:{' '}
          <Button onClick={() => setShowCode(!isShowCode)}>
            {isShowXML ? 'Hide' : 'Show'}
          </Button>
          {isShowCode && (
            <Pre>
              <Code>{inputCode}</Code>
            </Pre>
          )}
        </div>

        <div>
          Human Answer:{' '}
          <Button onClick={() => setShowAnswer(!isShowAnswer)}>
            {isShowAnswer ? 'Hide' : 'Show'}
          </Button>
          {isShowAnswer && task.HITId && <HumanAnswer taskId={task.HITId} />}
        </div>
      </TaskItemInner>
    </TaskItemContainer>
  )
}

function TaskList(props: TaskListProps) {
  return (
    <div>
      {Object.values(props.tasks).map(({task, inputCode}) => (
        <TaskItem task={task} inputCode={inputCode} key={task.HITId} />
      ))}
    </div>
  )
}

export function PublishTaskPage(props: Props) {
  const [task, setTask] = useState<HIT>()
  const [code, setCode] = useState('')
  const [balance, setBalance] = useState('0.00')
  const [store, setStore] = useState(defaultStoreState)

  async function publishTask() {
    const hit = await createHumanTaskFromCode(code)

    if (hit) setTask(hit)
  }

  useEffect(() => {
    getBalance().then(balance => balance && setBalance(balance))
    setStore(getStore())
  }, [task])

  return (
    <Container>
      <div style={{marginBottom: '1em'}}>
        Account Balance: <strong>{balance}$</strong>
      </div>

      {task && <TaskItem task={task} inputCode={code} />}

      <Textarea value={code} onChange={e => setCode(e.target.value)} />
      <Button
        onClick={publishTask}
        style={{margin: '20px 10px', padding: '10px 15px'}}>
        Create Human Labor Task
      </Button>

      <TaskList tasks={store.tasks} />
    </Container>
  )
}
