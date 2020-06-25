import {Machine} from '../src/modules/Machine'
import {cmp} from '../src/modules/Instructions'
import {jl, je, ja, jae} from '../src/modules/Comparison'

const m = () => Machine()

describe('conditional jump instructions', () => {
  it('should jump if 5 < 20', () => {
    let s = cmp(m(), 5, 20)
    s = jl(s, 0x5)

    expect(s.registers.eip).toBe(5)
  })

  it('should jump if 10 == 10', () => {
    let s = cmp(m(), 10, 10)
    s = je(s, 0x20)

    expect(s.registers.eip).toBe(0x20)
  })

  it('should jump if 30 > 10', () => {
    let s = cmp(m(), 30, 10)
    s = ja(s, 0x50)

    expect(s.registers.eip).toBe(0x50)
  })

  it('should jump if 5 >= 3 and 5 >= 5', () => {
    let s = cmp(m(), 5, 3)
    s = jae(s, 0x20)
    expect(s.registers.eip).toBe(0x20)

    s = cmp(m(), 5, 5)
    s = jae(s, 0x40)
    expect(s.registers.eip).toBe(0x40)
  })
})
