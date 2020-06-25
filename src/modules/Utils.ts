import {Op} from './Machine'

export const toLines = (str: string = '') =>
  str
    .trim()
    .split('\n')
    .map(x => x.trim())

export const trim = (str: string = '') => toLines(str).join('\n')

export const parseLine = (code: string = '') =>
  code
    .trim()
    .replace(',', '')
    .split(' ') as [Op, string, string]
