import {Program, step, add} from '../src/modules/Program'

describe('program', () => {
  it('should be able to run added lines', () => {
    let p = Program()

    const code = `
      mov eax, 0xbeef
      xor eax, eax
      inc eax
      jmp 0
    `

    p = add(p, code)

    // 0) mov eax, 0xbeef
    p = step(p)
    expect(p.machine.registers.eax).toBe(0xbeef)
    expect(p.machine.registers.eip).toBe(1)

    // 1) xor eax, eax
    p = step(p)
    expect(p.machine.registers.eax).toBe(0)
    expect(p.machine.registers.eip).toBe(2)

    // 2) inc eax
    p = step(p)
    expect(p.machine.registers.eax).toBe(1)
    expect(p.machine.registers.eip).toBe(3)

    // 3) jmp 0
    p = step(p)
    expect(p.machine.registers.eip).toBe(0)

    // 0) mov eax, 0xbeef
    p = step(p)
    expect(p.machine.registers.eax).toBe(0xbeef)
    expect(p.machine.registers.eip).toBe(1)
  })
})
