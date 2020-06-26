import {MachineState, Op, toReg, toVal, Machine} from './Machine'

import {
  mov,
  pop,
  push,
  xor,
  jmp,
  inc,
  dec,
  add,
  sub,
  cmp,
  mul,
  div,
} from './Instructions'

import {jne, je, jl, jle, ja, jae, jz} from './Comparison'
import {int} from './Interrupt'
import {parseLine} from './Utils'

export function interpret(s: MachineState, code: string): MachineState {
  const [op, a, b] = parseLine(code)

  const dst = toReg(a)
  const dstVal = toVal(s, a)
  const val = toVal(s, a)
  const srcVal = toVal(s, b)

  const handlers: Record<Op, () => MachineState> = {
    mov: () => mov(s, dst, srcVal),
    pop: () => pop(s, dst),
    push: () => push(s, val),
    xor: () => xor(s, dst, srcVal),
    jmp: () => jmp(s, val),
    inc: () => inc(s, dst),
    dec: () => dec(s, dst),
    add: () => add(s, dst, srcVal),
    sub: () => sub(s, dst, srcVal),
    mul: () => mul(s, dst, srcVal),
    div: () => div(s, dst, srcVal),
    cmp: () => cmp(s, dstVal, srcVal),
    jne: () => jne(s, dstVal),
    je: () => je(s, dstVal),
    jl: () => jl(s, dstVal),
    jle: () => jle(s, dstVal),
    ja: () => ja(s, dstVal),
    jae: () => jae(s, dstVal),
    jz: () => jz(s, dstVal),
    int: () => int(s, dstVal),
  }

  const handle = handlers[op]
  if (handle) return handle()

  return s
}

export const runLines = (lines: string, m = Machine()): MachineState =>
  lines.split('\n').reduce(interpret, m)
