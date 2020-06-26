import {get} from '../interpreter/Instructions'
import {Op, MachineState, Register, toVal, m} from '../interpreter/Machine'
import {
  SimplifyConfig,
  OpMap,
  RegMap,
  simplify,
  replaceArg,
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

export function toHuman(code: string, ms = m()) {
  const config: SimplifyConfig = {
    ...defaultConfig,
    transform: (op, $a, $b, code, ss) => {
      const a = toVal(ms, $a).toString()
      const b = toVal(ms, $b).toString()
      const evaluated = replaceArg(code, a, b, '')

      return [evaluated, ss]
    },
  }

  return simplify(code, config)
}
