import {runLines} from '../src/modules/Interpret'
import {Machine} from '../src/modules/Machine'
import {mov, setData} from '../src/modules/Instructions'
import {int} from '../src/modules/Interrupt'
import {Effect} from '../src/modules/Effect'

describe('interrupt routines', () => {
  it('should print hello world', () => {
    let s = Machine()
    s = setData(s, 0x1, 'Hello, World!')

    s = mov(s, 'eax', 4) // syscall = 4 (sys.write)
    s = mov(s, 'ebx', 1) // fd = 1 (stdout)
    s = mov(s, 'ecx', 0x1) // msg = ptr to 1 ()
    s = int(s, 0x80)

    expect(s.effects).toContainEqual<Effect>({
      type: 'print',
      text: 'Hello, World!',
    })
  })

  it('should read file from fd 30', () => {
    let s = Machine()

    s = mov(s, 'eax', 3) // sys.read
    s = mov(s, 'ebx', 30) // fd 30
    s = int(s, 0x80)

    expect(s.effects).toContainEqual<Effect>({type: 'read', fd: 30})
  })
})
