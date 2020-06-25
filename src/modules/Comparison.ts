import {Flags} from './Flags'
import {MachineState} from './Machine'
import {jmp} from './Instructions'

// Predicates
const isEqual = (flags: Flags) => flags.zero && !flags.carry
const isLess = (flags: Flags) => !flags.zero && flags.carry
const isAbove = (flags: Flags) => !flags.zero && !flags.carry

const jumpIf = (s: MachineState, address: number, pred: boolean) =>
  pred ? jmp(s, address) : s

export const je = (s: MachineState, address: number) =>
  jumpIf(s, address, isEqual(s.flags))

export const jne = (s: MachineState, address: number) =>
  jumpIf(s, address, !isEqual(s.flags))

// Jump if lesser
export const jl = (s: MachineState, address: number) =>
  jumpIf(s, address, isLess(s.flags))

// Jump if above
export const ja = (s: MachineState, address: number) =>
  jumpIf(s, address, isAbove(s.flags))

// Jump if less or equal
export const jle = (s: MachineState, address: number) =>
  jumpIf(s, address, isLess(s.flags) || isEqual(s.flags))

// Jump if above or equal
export const jae = (s: MachineState, address: number) =>
  jumpIf(s, address, isAbove(s.flags) || isEqual(s.flags))

// Jump if zero flag is set
export const jz = (s: MachineState, address: number) =>
  jumpIf(s, address, s.flags.zero)

// Jump if zero flag is not set
export const jnz = (s: MachineState, address: number) =>
  jumpIf(s, address, !s.flags.zero)
