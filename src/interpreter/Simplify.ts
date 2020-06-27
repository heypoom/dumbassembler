import {Op, Register} from './Machine'
import {parseLine, toLines} from './Utils'
import {JSIL} from './JSIL.Simplify'

export type OpMap = Record<Op, string>
export type RegMap = Record<Register, string>

export const compareJumpOps: Op[] = [
  'je',
  'jle',
  'jne',
  'ja',
  'jae',
  'jl',
  'jz',
]

export type SimplifyResult = [string, SimplifyState]

export type SimplifyTransform = (
  op: string,
  a: string,
  b: string,
  simplified: string,
  ss: SimplifyState,
) => SimplifyResult | null

export interface SimplifyConfig {
  ops: OpMap
  regs?: RegMap
  transform?: SimplifyTransform
}

export function simplifyArg(arg: string, regs = JSIL.regs) {
  if (!regs) return arg
  if (!arg) return '??'

  const reg = regs[arg as Register]
  if (reg) return reg

  return arg
}

export interface SimplifyState {
  cmpA: string
  cmpB: string
}

export const replaceArg = (
  code: string,
  a = '',
  b = '',
  c = '',
  regs = JSIL.regs,
) =>
  code
    .replace(/\$a/g, simplifyArg(a, regs))
    .replace(/\$b/g, simplifyArg(b, regs))
    .replace(/\$c/g, simplifyArg(c, regs))

export const createSimplifyState = (): SimplifyState => ({cmpA: '', cmpB: ''})

export function simplifyLine(
  line: string,
  ss = createSimplifyState(),
  config = JSIL,
): SimplifyResult {
  if (!line) return ['', ss]
  if (line.startsWith('//') || line.startsWith(';')) return [line, ss]

  const [opcode, a, b] = parseLine(line)

  const op = opcode as Op

  const code = config.ops[op]
  if (!code) return [`// ${line}`, ss]

  if (op === 'cmp') return ['NUL', {...ss, cmpA: a, cmpB: b}]

  if (config.transform) {
    let transformResult = config.transform(op, a, b, code, ss)

    if (transformResult) return transformResult
  }

  let output = replaceArg(code, a, b, '', config.regs)

  if (compareJumpOps.includes(op)) {
    output = replaceArg(code, ss.cmpA, ss.cmpB, a, config.regs)
  }

  return [output, ss]
}

export function simplifyWithState(
  code: string,
  config = JSIL,
  ss = createSimplifyState(),
): SimplifyResult {
  const lines = toLines(code)
  const simplified = []

  for (let line of lines) {
    const [result, nextState] = simplifyLine(line, ss, config)
    ss = nextState

    if (result === 'NUL') continue
    simplified.push(result)
  }

  return [simplified.join('\n'), ss]
}

export const simplify = (
  code: string,
  config = JSIL,
  ss = createSimplifyState(),
) => simplifyWithState(code, config, ss)[0]
