import {trim} from '../../src/interpreter/Utils'
import {createCrowdFields} from '../../src/skynet/MTurkPayload'

describe('generate MTurk XML form', () => {
  it('should create input form for add eax, 10', () => {
    const input = createCrowdFields(`
        mov eax, 5
        add eax, 10
    `)

    const output = `
      <p>what is 5 + 10?</p>
      <crowd-input name="add_eax_10" placeholder="what is 5 + 10?" type="number" required></crowd-input>
    `

    expect(input).toBe(trim(output))
  })

  it('should create input form for multiple instructions', () => {
    const input = createCrowdFields(`
        mov eax, 5
        add eax, 10
        sub eax, 8
        inc eax
    `)

    const output = `
      <p>what is 5 + 10?</p>
      <crowd-input name="add_eax_10" placeholder="what is 5 + 10?" type="number" required></crowd-input>
      <p>what is 15 - 8?</p>
      <crowd-input name="sub_eax_8" placeholder="what is 15 - 8?" type="number" required></crowd-input>
      <p>what is 7 + 1?</p>
      <crowd-input name="inc_eax" placeholder="what is 7 + 1?" type="number" required></crowd-input>
    `

    expect(input).toBe(trim(output))
  })
})
