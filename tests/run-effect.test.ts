import {add, Program, stepOver} from '../src/modules/Program'
import {setData} from '../src/modules/Instructions'

describe('effect runner', () => {
  it('should be able to react to effects', () => {
    let p = Program()
    p.machine = setData(p.machine, 0x5, 'Hello, World!')

    let code = `
      mov eax, 4
      mov ebx, 1
      mov ecx, 0x5
    `

    p = add(p, code)
    p = stepOver(p)
    expect(p.machine.effects.length).toBe(0)

    p = add(p, 'int 0x80')
    p = stepOver(p)

    expect(p.machine.effects).toContainEqual({
      type: 'print',
      text: 'Hello, World!',
    })
  })
})
