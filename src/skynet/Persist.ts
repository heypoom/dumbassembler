import {HIT} from 'aws-sdk/clients/mturk'

const PERSIST_KEY = 'dumbassembly'

export interface Task {
  task: HIT
  inputCode: string
}

export interface TaskAnswer {
  instruction: string
  result: string
}

export interface Store {
  tasks: Record<string, Task>
  results: Record<string, TaskAnswer[]>
}

export const defaultStoreState: Store = {
  tasks: {},
  results: {},
}

export const initStoreValue = () =>
  localStorage.setItem(PERSIST_KEY, JSON.stringify(defaultStoreState))

export function getStore() {
  const string = localStorage.getItem(PERSIST_KEY)

  if (!string) {
    initStoreValue()
    return defaultStoreState
  }

  return JSON.parse(string) as Store
}

export const getValue = <T extends keyof Store>(key: T): Store[T] =>
  getStore()[key]

export function setValue<T extends keyof Store>(key: T, value: Store[T]) {
  const data = getStore()

  const newState: Store = {...data, [key]: value}
  const newStateJSON = JSON.stringify(newState)

  localStorage.setItem(PERSIST_KEY, newStateJSON)
}

export function saveTask(hit: HIT, inputCode: string) {
  if (!hit.HITId) return

  const task: Task = {
    task: hit,
    inputCode,
  }

  setValue('tasks', {...getValue('tasks'), [hit.HITId]: task})
}

export const getTask = (taskId: string) => getValue('tasks')[taskId]

export function updateTaskStatus(hit: HIT) {
  const id = hit.HITId
  if (!id) return

  const task: Task = {...getTask(id), task: hit}
  setValue('tasks', {...getValue('tasks'), [id]: task})
}

export const saveTaskResult = (taskId: string, answers: TaskAnswer[]) =>
  setValue('results', {...getValue('results'), [taskId]: answers})

export const getStoredTasks = () => getValue('tasks')
export const getTaskResults = () => getValue('results')
export const getTaskResult = (taskId: string) => getValue('results')[taskId]
