import {Machine} from '../src/modules/Machine'
import {interpret, runLines} from '../src/modules/Interpret'

const m = () => Machine()

describe('textual interpreter', () => {
  it('should be able to interpret mov instruction', () => {
    const s = interpret(m(), 'mov ecx, 0xdead')

    expect(s.registers.ecx).toBe(0xdead)
  })

  it('should be able to interpret xor instruction', () => {
    let s = interpret(m(), 'mov eax, 0xbeer')
    s = interpret(s, 'xor eax, eax')

    expect(s.registers.eax).toBe(0)
  })

  it('should be able to interpret push and pop instruction', () => {
    const s = runLines(`
      push 0xdead
      pop ebx
    `)

    expect(s.registers.ebx).toBe(0xdead)
  })
})
