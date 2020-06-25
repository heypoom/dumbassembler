import {runLines} from '../src/modules/Interpret'
import {Program, add, step} from '../src/modules/Program'

describe('comparison program', () => {
  it('should be able to run comparison program in pure mode', () => {
    let s = runLines(`
      mov eax, 20
      mov ebx, 40

      add ebx, eax
      sub ebx, 5

      cmp ebx, eax
      ja 0x8
    `)

    expect(s.registers.eax).toBe(20)
    expect(s.registers.ebx).toBe(55)
    expect(s.registers.eip).toBe(0x8)

    let code = `
      cmp eax, ebx
      jl 0x5
    `

    s = runLines(code, s)
    expect(s.registers.eip).toBe(0x5)
  })

  it('should be able to run comparison program in line-by-line mode', () => {
    let p = Program()

    const code = `
      mov eax, 20
      mov ebx, 40
      add ebx, eax
      sub ebx, 5
      cmp ebx, eax
    `

    p = add(p, code)

    p = step(p) // mov eax, 20
    expect(p.machine.registers.eax).toBe(20)

    p = step(p) // mov ebx, 40
    expect(p.machine.registers.ebx).toBe(40)

    p = step(p) // add ebx, eax
    expect(p.machine.registers.ebx).toBe(60)

    p = step(p) // sub ebx, 5
    expect(p.machine.registers.eax).toBe(20)
    expect(p.machine.registers.ebx).toBe(55)

    p = step(p) // 20 < 55
    expect(p.machine.flags.carry).toBe(false)
    expect(p.machine.flags.zero).toBe(false)
  })
})
