import {toHuman} from '../../src/skynet/HumanizeInstruction'
import {m} from '../../src/interpreter/Machine'
import {mov} from '../../src/interpreter/Instructions'

describe('assembly to human translator', () => {
  it('should translate arithmetic instructions to math expressions', () => {
    let s = m()
    s = mov(s, 'eax', 25)
    s = mov(s, 'ebx', 1337)

    expect(toHuman('add eax, 5', s)).toBe('what is 25 + 5?')
    expect(toHuman('add ebx, eax', s)).toBe('what is 1337 + 25?')
    expect(toHuman('sub ebx, eax', s)).toBe('what is 1337 - 25?')
    expect(toHuman('inc eax', s)).toBe('what is 25 + 1?')
    expect(toHuman('dec ebx', s)).toBe('what is 1337 - 1?')

    expect(toHuman('mul eax, 50', s)).toBe('what is 25 * 50?')
    expect(toHuman('mul ebx, 50', s)).toBe('what is 1337 * 50?')
    expect(toHuman('mul eax, ebx', s)).toBe('what is 25 * 1337?')

    expect(toHuman('div eax, 5', s)).toBe('what is 25 / 5?')
    expect(toHuman('div eax, 1', s)).toBe('what is 25 / 1?')
  })
})
