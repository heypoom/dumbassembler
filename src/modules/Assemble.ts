import escapeRegex from 'lodash.escaperegexp'

import {simpleOpMap, compareJumpOps, simpleRegMap} from './Simplify'
import {Op, Register} from './Machine'
import {toLines} from './Utils'

type OpRegexMap = Partial<Record<Op, RegExp>>

function buildOpRegexMap(): OpRegexMap {
  const regexMap: OpRegexMap = {}

  for (let op in simpleOpMap) {
    let code = simpleOpMap[op as Op]
    let pattern = escapeRegex(code).replace(/\\\$[a-c]/g, '(\\w+)')

    regexMap[op as Op] = new RegExp(pattern, 'i')
  }

  return regexMap
}

const opRegexMap = buildOpRegexMap()

export function assembleArg(arg: string) {
  for (let reg in simpleRegMap) {
    let sh = simpleRegMap[reg as Register]
    if (arg === sh) return reg
  }

  return arg
}

export function assembleLine(code: string) {
  for (let op in opRegexMap) {
    let regex = opRegexMap[op as Op]
    if (!regex) continue

    let m = code.match(regex)
    if (!m) continue

    const [_, a, b, c] = m.map(assembleArg)

    if (compareJumpOps.includes(op as Op)) {
      return `cmp ${a}, ${b}\n${op} ${c}`
    }

    if (simpleOpMap[op as Op].includes('$b')) {
      return `${op} ${a}, ${b}`
    }

    return `${op} ${a}`
  }

  return ''
}

export const assemble = (lines: string) =>
  toLines(lines)
    .map(assembleLine)
    .join('\n')
