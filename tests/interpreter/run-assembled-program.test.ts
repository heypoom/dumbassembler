import {assemble} from '../../src/interpreter/Assemble'
import {setData} from '../../src/interpreter/Instructions'
import {m} from '../../src/interpreter/Machine'
import {runLines} from '../../src/interpreter/Interpret'
import {PrintEffect} from '../../src/interpreter/Effect'

describe('run program assembled from simplified code', () => {
  it('should be able to run hello world from simplified code', () => {
    let s = setData(m(), 1, 'Hello, World!')

    let code = `
      a = 4
      b = 1
      c = 1

      interrupt(0x80)
    `

    s = runLines(assemble(code), s)

    const [effect] = s.effects as [PrintEffect]
    expect(effect.type).toBe('print')
    expect(effect.text).toBe('Hello, World!')
  })
})
