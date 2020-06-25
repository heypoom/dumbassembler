import {trim} from '../src/modules/Utils'
import {simplify} from '../src/modules/Simplify'

describe('simplify module', () => {
  it('should simplify mov instructions', () => {
    expect(simplify('mov eax, ebx')).toBe('a = b')
    expect(simplify('mov ebx, 5')).toBe('b = 5')
    expect(simplify('mov ecx, ecx')).toBe('c = c')
    expect(simplify('mov edx, 0x12')).toBe('d = 0x12')
  })

  it('should simplify polynomial program', () => {
    let input = `
      mov eax, 2

      int 0x80
      push ecx

      int 0x80
      push ecx

      pop eax
      pop ebx

      mov ecx, eax
      mul ecx, ecx
      mov edx, ecx

      mov ecx, 2
      mul ecx, eax
      mul ecx, ebx
      add edx, ecx

      mov ecx, ebx
      mul ecx, ecx
      add edx, ecx
    `

    let output = `
      a = 2

      interrupt(0x80)
      stack.push(c)

      interrupt(0x80)
      stack.push(c)

      a = stack.pop()
      b = stack.pop()

      c = a
      c *= c
      d = c

      c = 2
      c *= a
      c *= b
      d += c

      c = b
      c *= c
      d += c
    `

    expect(simplify(input)).toBe(trim(output))
  })

  it('should be able to simplify comparison program', () => {
    let input = `
      cmp ebx, eax
      ja 0x8

      cmp eax, ecx
      jle 0x8

      cmp eax, ecx
      jne 0x8
    `

    let output = `
      if (b > a) goto(0x8)

      if (a <= c) goto(0x8)

      if (a != c) goto(0x8)
    `

    expect(simplify(input)).toBe(trim(output))
  })
})
