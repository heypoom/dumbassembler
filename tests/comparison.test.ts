import {cmp} from '../src/modules/Instructions'
import {m} from '../src/modules/Machine'

describe('comparison instruction', () => {
  it('should be able to compare 2 < 5', () => {
    // 2 < 5. zero should be false, and carry should be true
    let s = cmp(m(), 2, 5)

    expect(s.flags.zero).toBe(false)
    expect(s.flags.carry).toBe(true)
  })

  it('should be able to compare 20 > 8', () => {
    // 20 > 8. zero and carry should be false.
    let s = cmp(m(), 20, 8)

    expect(s.flags.zero).toBe(false)
    expect(s.flags.carry).toBe(false)
  })

  it('should be able to compare 10 == 10', () => {
    // 10 == 10. zero should be true, carry should be false.
    let s = cmp(m(), 10, 10)

    expect(s.flags.zero).toBe(true)
    expect(s.flags.carry).toBe(false)
  })
})
