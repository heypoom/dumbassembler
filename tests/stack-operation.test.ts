import {m} from '../src/modules/Machine'
import {push, pop} from '../src/modules/Instructions'

describe('stack operations', () => {
  it('should increment stack pointer when pushing to the stack', () => {
    let s = m()
    s = push(s, 0x50)

    expect(s.memory[1]).toBe(0x50)
    expect(s.registers.esp).toBe(1)

    s = push(s, 0x80)

    expect(s.memory[2]).toBe(0x80)
    expect(s.registers.esp).toBe(2)
  })

  it('should decrement stack pointer when popping the stack', () => {
    let s = m()

    s = push(s, 0x10)
    s = push(s, 0x20)

    s = pop(s, 'eax')
    expect(s.registers.eax).toBe(0x20)
    expect(s.registers.esp).toBe(1)

    s = pop(s, 'eax')
    expect(s.registers.eax).toBe(0x10)
    expect(s.registers.esp).toBe(0)

    s = pop(s, 'eax')
    expect(s.registers.eax).toBe(0)
    expect(s.registers.esp).toBe(0)
  })
})
