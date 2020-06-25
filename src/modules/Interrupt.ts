import {MachineState} from './Machine'
import {get} from './Instructions'
import {addEffect} from './Effect'

enum Interrupts {
  KERNEL = 0x80,
}

enum Sys {
  READ = 3,
  WRITE = 4,
}

export function write(s: MachineState, fd: number, msgPtr: number) {
  if (fd === 1) return addEffect(s, {type: 'print', text: s.data[msgPtr]})

  return s
}

export const read = (s: MachineState, fd: number) =>
  addEffect(s, {type: 'read', fd})

// Invokes the interrupt routines, such as kernel syscalls.
export function int(s: MachineState, interrupt: number) {
  let syscall = get(s, 'eax')
  let ebx = get(s, 'ebx')
  let ecx = get(s, 'ecx')
  let edx = get(s, 'edx')

  const syscalls: Record<Sys, () => MachineState> = {
    [Sys.WRITE]: () => write(s, ebx, ecx),
    [Sys.READ]: () => read(s, ebx),
  }

  if (interrupt === Interrupts.KERNEL) {
    const handler = syscalls[syscall as Sys]
    if (handler) return handler()
  }

  return s
}
