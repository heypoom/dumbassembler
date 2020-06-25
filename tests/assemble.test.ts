import {trim} from '../src/modules/Utils'
import {assemble} from '../src/modules/Assemble'

describe('assemble simplified code', () => {
  it('should be able to assemble simplified code', () => {
    let input = `
      a = 1
      b += a

      if (b > a) goto(c)
      if (a <= c) goto(b)

      stack.push(50)
      b = stack.pop()
    `

    let output = `
      mov eax, 1
      add ebx, eax

      cmp ebx, eax
      ja ecx
      cmp eax, ecx
      jle ebx

      push 50
      pop ebx
    `

    expect(assemble(input)).toBe(trim(output))
  })
})
