import {assoc, assocPath} from 'ramda'

import {MachineState, Register} from './Machine'
import {Flags} from './Flags'

export const mov = (
  s: MachineState,
  reg: Register,
  value: number,
): MachineState => assocPath(['registers', reg], value, s)

export const memset = (
  s: MachineState,
  address: number,
  value: number,
): MachineState => assocPath(['memory', address], value, s)

export const setData = (
  s: MachineState,
  address: number,
  data: string,
): MachineState => assocPath(['data', address], data, s)

export const setFlag = (s: MachineState, flags: Partial<Flags>): MachineState =>
  assoc('flags', {...s.flags, ...flags}, s)

export const jmp = (s: MachineState, address: number) => mov(s, 'eip', address)

export const get = (s: MachineState, reg: Register) => s.registers[reg] || 0

export const memget = (s: MachineState, address: number) =>
  s.memory[address] || 0

export function push(s: MachineState, value: number) {
  let ms = inc(s, 'esp')
  ms = memset(ms, get(ms, 'esp'), value)

  return ms
}

export function pop(s: MachineState, reg: Register) {
  let ms = mov(s, reg, memget(s, get(s, 'esp')))
  ms = dec(ms, 'esp')

  return ms
}

export const xor = (s: MachineState, reg: Register, value: number) =>
  mov(s, reg, get(s, reg) ^ value)

export const add = (s: MachineState, reg: Register, value: number) =>
  mov(s, reg, Math.max(get(s, reg) + value, 0))

export const sub = (s: MachineState, reg: Register, value: number) =>
  add(s, reg, -value)

export const mul = (s: MachineState, reg: Register, value: number) =>
  mov(s, reg, get(s, reg) * value)

export const div = (s: MachineState, reg: Register, value: number) =>
  mov(s, reg, Math.round(get(s, reg) / value))

export const inc = (s: MachineState, reg: Register) => add(s, reg, 1)
export const dec = (s: MachineState, reg: Register) => sub(s, reg, 1)

export function cmp(s: MachineState, dstVal: number, srcVal: number) {
  if (dstVal === srcVal) return setFlag(s, {zero: true, carry: false})

  if (dstVal < srcVal) return setFlag(s, {zero: false, carry: true})

  return setFlag(s, {zero: false, carry: false})
}
