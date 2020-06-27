import {get} from '../interpreter/Instructions'
import {Op, MachineState, Register, toVal, m} from '../interpreter/Machine'
import {
  SimplifyConfig,
  OpMap,
  RegMap,
  simplify,
  replaceArg,
  compareJumpOps,
  SimplifyTransform,
  simplifyWithState,
  SimplifyState,
} from '../interpreter/Simplify'

export const instructionsForHuman: OpMap = {
  push: '',
  pop: '',
  mov: '',
  int: '',
  jmp: '',
  xor: '', // TODO: Make humans do bit level op.
  add: 'what is $a + $b?',
  sub: 'what is $a - $b?',
  mul: 'what is $a * $b?',
  div: 'what is $a / $b?',
  inc: 'what is $a + 1?',
  dec: 'what is $a - 1?',
  cmp: 'compare $a with $b',
  je: 'is $a less than $b?',
  jle: 'is $a less than or equal $b?',
  jne: 'is $a not equal to $b?',
  ja: 'is $a more than $b?',
  jae: 'is $a more than or equal to $b?',
  jl: 'is $a less than $b?',
  jz: 'is $a zero?',
}

const ignoreOps: Op[] = ['int', 'cmp', 'push', 'pop', 'jmp', 'xor']

const defaultConfig: SimplifyConfig = {
  ops: instructionsForHuman,
}

export type QuestionType = 'NUMBER' | 'YES_NO' | 'NONE'

export function getQuestionType(question: string): QuestionType {
  if (question.startsWith('what is')) return 'NUMBER'
  if (question.startsWith('is')) return 'YES_NO'

  return 'NONE'
}

export const createHumanTransform = (ms = m()): SimplifyTransform => (
  op,
  $a,
  $b,
  code,
  ss,
) => {
  if (op === 'cmp') {
    console.log(op, $a, $b)

    return ['compare 5 with 3', {...ss, cmpA: $a, cmpB: $b}]
  }

  console.log(ss)

  const a = toVal(ms, $a).toString()
  const b = toVal(ms, $b).toString()

  if (compareJumpOps.includes(op as Op)) {
    const cA = toVal(ms, ss.cmpA).toString()
    const cB = toVal(ms, ss.cmpB).toString()

    return [replaceArg(code, cA, cB, a), ss]
  }

  return [replaceArg(code, a, b, ''), ss]
}

export function toHumanWithState(code: string, ms = m(), ss?: SimplifyState) {
  const config: SimplifyConfig = {
    ...defaultConfig,
    transform: createHumanTransform(ms),
  }

  return simplifyWithState(code, config, ss)
}

export const toHuman = (code: string, ms = m()) => toHumanWithState(code, ms)[0]
