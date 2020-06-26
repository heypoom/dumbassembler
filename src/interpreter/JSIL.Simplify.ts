import {OpMap, RegMap, SimplifyConfig} from './Simplify'

/**
 * JavaScript Intermediate Language (JSIL) simplification syntax.
 */

export const jsOperations: OpMap = {
  push: 'stack.push($a)',
  pop: '$a = stack.pop()',
  mov: '$a = $b',
  add: '$a += $b',
  sub: '$a -= $b',
  mul: '$a *= $b',
  div: '$a /= $b',
  xor: '$a ^= $b',
  int: 'interrupt($a)',
  inc: '$a++',
  dec: '$a--',
  cmp: 'compare($a, $b)',
  je: 'if ($a == $b) goto($c)',
  jle: 'if ($a <= $b) goto($c)',
  jne: 'if ($a != $b) goto($c)',
  ja: 'if ($a > $b) goto($c)',
  jae: 'if ($a >= $b) goto($c)',
  jl: 'if ($a < $b) goto($c)',
  jz: 'if (isZero($a)) goto($c)',
  jmp: 'goto($a)',
}

export const jsVarNames: RegMap = {
  eip: 'IP',
  eax: 'a',
  ebx: 'b',
  ecx: 'c',
  edx: 'd',
  esp: 'SP',
  nul: ' ',
}

export const JSIL: SimplifyConfig = {
  ops: jsOperations,
  regs: jsVarNames,
}
