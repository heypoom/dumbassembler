import {Op} from '../interpreter/Machine'

export const instructionsForHuman: Record<Op, string> = {
  push: 'stack.push($a)',
  pop: '$a = stack.pop()',
  mov: '$a = $b',
  add: 'what is $a + $b?',
  sub: 'what is $a - $b?',
  mul: 'what is $a * $b?',
  div: 'what is $a / $b?',
  xor: 'what is $a ^ $b?',
  int: 'write $a in the box.',
  inc: 'what is a + 1?',
  dec: 'what is a - 1?',
  cmp: 'compare $a with $b',
  je: 'if $a is less than $b, type in $c. Otherwise, leave it blank.',
  jle: 'if $a is less than or equal $b, type in $c. Otherwise, leave it blank.',
  jne: 'if $a is not equal to $b, type in $c. Otherwise, leave it blank.',
  ja: 'if ($a > $b), write $c in the input. Otherwise, leave it blank.',
  jae: 'if ($a >= $b), write $c in the input. Otherwise, leave it blank.',
  jl: 'if ($a < $b), write $c in the input. Otherwise, leave it blank.',
  jz: 'if (isZero($a)), write $c in the input. Otherwise, leave it blank.',
  jmp: 'type in $a',
}
