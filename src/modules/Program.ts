import {MachineState, Machine} from './Machine'
import {interpret, runLines} from './Interpret'
import {get, inc} from './Instructions'
import {toLines} from './Utils'
import {assemble} from './Assemble'

export type ProgramState = {
  program: string[]
  machine: MachineState
}

export const Program = (): ProgramState => ({program: [], machine: Machine()})

export type ActionTypes =
  | 'ADD'
  | 'ASSEMBLE'
  | 'ADD_LINE'
  | 'RUN'
  | 'EVAL'
  | 'RESET'

export const RUN: ProgramAction = {type: 'RUN'}
export const RESET: ProgramAction = {type: 'RESET'}

export const addLine = (line: string): ProgramAction => ({
  type: 'ADD_LINE',
  payload: line,
})

export const evaluate = (code: string): ProgramAction => ({
  type: 'EVAL',
  payload: code,
})

const createReducer = (
  s: ProgramState,
): Record<ActionTypes, (args: any) => ProgramState> => ({
  ADD: (lines: string) => add(s, lines),
  ADD_LINE: (p: string) => ({...s, program: [...s.program, p]}),

  ASSEMBLE: (lines: string) => ({
    ...s,
    program: [...s.program, ...assemble(lines).split('\n')],
  }),

  RUN: () => {
    let ip = get(s.machine, 'eip')
    let line = s.program[ip]
    if (!line) return s

    let m = interpret(s.machine, line)
    if (!line.startsWith('jmp')) m = inc(m, 'eip')

    return {...s, machine: m}
  },

  EVAL: (code: string) => ({
    ...s,
    machine: runLines(code, s.machine),
  }),

  RESET: () => Program(),
})

export interface ProgramAction {
  type: ActionTypes
  payload?: any
}

export function programReducer(state: ProgramState, action: ProgramAction) {
  const reducers = createReducer(state)
  const r = reducers[action.type]
  if (r) return r(action.payload)

  return state
}

export const run = (p: ProgramState) => r(p, RUN)
export const r = programReducer

export function step(p: ProgramState, count: number = 1): ProgramState {
  for (let i = 0; i < count; i++) p = run(p)

  return p
}

export const stepOver = (p: ProgramState) =>
  step(p, p.program.length - (p.machine.registers.eip || 0))

export const addSingleLine = (p: ProgramState, line: string) =>
  r(p, addLine(line))

export const add = (p: ProgramState, lines: string) =>
  toLines(lines).reduce(addSingleLine, p)
