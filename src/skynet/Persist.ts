const PERSIST_KEY = 'dumbassembly'

export interface Store {
  tasks: string[]
}

export const defaultStoreState: Store = {
  tasks: [],
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

export const saveTask = (taskId: string) =>
  setValue('tasks', [...getValue('tasks'), taskId])

export const getStoredTasks = () => getValue('tasks')
