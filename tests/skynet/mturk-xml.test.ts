import {trim} from '../../src/interpreter/Utils'
import {createCrowdFields} from '../../src/skynet/MTurkRequester'

describe('MTurk XML Payload', () => {
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
})
