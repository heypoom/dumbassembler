import {m} from '../src/modules/Machine'

import {
  mov,
  xor,
  get,
  push,
  pop,
  jmp,
  add,
  sub,
  inc,
  dec,
} from '../src/modules/Instructions'

describe('instructions', () => {
  it('should be able to move value into a register', () => {
    const s = mov(m(), 'eax', 0xdead)
    expect(s.registers.eax).toBe(0xdead)
  })

  it('should be able to xor itself and return zero', () => {
    let s = mov(m(), 'eax', 0xdead)
    s = xor(s, 'eax', get(s, 'eax'))

    expect(s.registers.eax).toBe(0)
  })

  it('should be able to push value to the stack', () => {
    let s = mov(m(), 'esp', 0x5)
    s = push(s, 0xbeef)

    expect(s.memory[6]).toBe(0xbeef)
  })

  it('should be able to pop value from the stack', () => {
    let s = mov(m(), 'esp', 0x5)
    s = push(s, 0xbeef)
    s = pop(s, 'eax')

    expect(s.registers.eax).toBe(0xbeef)
  })

  it('should be able to jump by modifying instruction pointer', () => {
    let s = jmp(m(), 0x20)
    expect(s.registers.eip).toBe(0x20)
  })

  it('should be able to add and subtract number', () => {
    let s = mov(m(), 'eax', 0x20)
    s = add(s, 'eax', 0x50)
    expect(s.registers.eax).toBe(0x70)

    s = sub(s, 'eax', 0x10)
    expect(s.registers.eax).toBe(0x60)
  })

  it('should be able to increment and decrement number', () => {
    let s = mov(m(), 'eax', 0x5)
    s = inc(s, 'eax')
    expect(s.registers.eax).toBe(0x6)

    s = dec(s, 'eax')
    expect(s.registers.eax).toBe(0x5)
  })
})
