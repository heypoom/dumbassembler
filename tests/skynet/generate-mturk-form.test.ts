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
      <crowd-input name="1_add_eax_10" placeholder="what is 5 + 10?" type="number" required></crowd-input>
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
      <crowd-input name="1_add_eax_10" placeholder="what is 5 + 10?" type="number" required></crowd-input>
      <p>what is 15 - 8?</p>
      <crowd-input name="2_sub_eax_8" placeholder="what is 15 - 8?" type="number" required></crowd-input>
      <p>what is 7 + 1?</p>
      <crowd-input name="3_inc_eax" placeholder="what is 7 + 1?" type="number" required></crowd-input>
    `

    expect(input).toBe(trim(output))
  })

  it('should be able to compute polynomial', () => {
    const input = createCrowdFields(`
      mov eax, 15
      mov ebx, 5
      mov ecx, eax
      mul ecx, ecx
      mov edx, ecx
      mov ecx, 2
      mul ecx, eax
      mul ecx, ebx
      add edx, ecx
      mov ecx, ebx
      mul ecx, ecx
      add edx, ecx
    `)

    console.log(input)

    const output = `
      <p>what is 15 * 15?</p>
      <crowd-input name="3_mul_ecx_ecx" placeholder="what is 15 * 15?" type="number" required></crowd-input>


      <p>what is 2 * 15?</p>
      <crowd-input name="6_mul_ecx_eax" placeholder="what is 2 * 15?" type="number" required></crowd-input>
      <p>what is 30 * 5?</p>
      <crowd-input name="7_mul_ecx_ebx" placeholder="what is 30 * 5?" type="number" required></crowd-input>
      <p>what is 225 + 150?</p>
      <crowd-input name="8_add_edx_ecx" placeholder="what is 225 + 150?" type="number" required></crowd-input>

      <p>what is 5 * 5?</p>
      <crowd-input name="10_mul_ecx_ecx" placeholder="what is 5 * 5?" type="number" required></crowd-input>
      <p>what is 375 + 25?</p>
      <crowd-input name="11_add_edx_ecx" placeholder="what is 375 + 25?" type="number" required></crowd-input>
    `

    expect(input).toBe(trim(output))
  })
})
