import {Op, m, toVal} from '../interpreter/Machine'
import {parseLine, toLines} from '../interpreter/Utils'
import {interpret} from '../interpreter/Interpret'

type Cost = number
type CostFn = (a: number, b: number) => Cost

const DigitDependent = (weight: number): CostFn => (a, b) => {
  const lenA = String(a).length
  const lenB = String(b).length

  let max = Math.max(lenA, lenB)

  return Math.floor(max * weight * 15)
}

const executionTimeMap: Record<Op, Cost | CostFn> = {
  push: -1,
  pop: -1,
  mov: 0,
  add: DigitDependent(0.7),
  sub: DigitDependent(1),
  mul: DigitDependent(3),
  div: DigitDependent(3.8),
  xor: -1,
  int: -1,
  inc: 10,
  dec: 10,
  cmp: 0,
  je: 15,
  jle: 20,
  jne: 20,
  ja: 20,
  jae: 20,
  jl: 20,
  jz: 20,
  jmp: 0,
}

export function getExecutionTimeForOp(op: Op, a = 0, b = 0): Cost {
  let execTime = executionTimeMap[op]
  if (typeof execTime === 'function') return execTime(a, b)
  if (typeof execTime === 'number') return execTime

  return 0
}

export function getTotalExecutionTime(code: string): Cost {
  let ms = m()

  function computeCost(line: string): Cost {
    const [op, a, b] = parseLine(line)
    ms = interpret(ms, line)

    return getExecutionTimeForOp(op, toVal(ms, a), toVal(ms, b))
  }

  return toLines(code)
    .map(computeCost)
    .reduce((a, b) => a + b)
}
