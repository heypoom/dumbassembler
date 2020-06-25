import {assemble} from '../src/modules/Assemble'
import {setData} from '../src/modules/Instructions'
import {m} from '../src/modules/Machine'
import {runLines} from '../src/modules/Interpret'
import {PrintEffect} from '../src/modules/Effect'

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
