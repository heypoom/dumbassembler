import {MachineState} from './Machine'

export interface PrintEffect {
  type: 'print'
  text: string
}

export interface ReadEffect {
  type: 'read'
  fd: number
}

export type Effect = PrintEffect | ReadEffect

export const addEffect = (s: MachineState, effect: Effect): MachineState => ({
  ...s,
  effects: [...s.effects, effect],
})
