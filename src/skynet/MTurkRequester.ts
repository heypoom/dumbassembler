import {QuestionType, toHuman, getQuestionType} from './HumanizeInstruction'
import {m, Op} from '../interpreter/Machine'
import {toLines, trim, trim} from '../interpreter/Utils'
import {interpret} from '../interpreter/Interpret'

export const MTurkXML = (htmlCode: string) => `
  <HTMLQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2011-11-11/HTMLQuestion.xsd">
    <HTMLContent>
      <![CDATA[<!DOCTYPE html>
        <body>
          <script src="https://assets.crowd.aws/crowd-html-elements.js"></script>

          <crowd-form answer-format="flatten-objects">
            <div>
              <strong>Instruction: <span>Answer this math question.</span></strong>
              <div>${htmlCode}</div>
            </div>
          </crowd-form>
        </body>
      ]]>
    </HTMLContent>
    <FrameHeight>0</FrameHeight>
  </HTMLQuestion>
`

type ElementMap = Record<QuestionType, (question: string, id: string) => string>

export const crowdElementMap: ElementMap = {
  NONE: () => '',
  NUMBER: (question, id) => `
    <p>${question}</p>
    <crowd-input name="${id}" placeholder="${question}" type="number" required></crowd-input>
  `,
  YES_NO: (question, id) => `
    <crowd-checkbox name="${id}">${question}</crowd-checkbox>
  `,
}

const toFormId = (code: string) => code.replace(',', '').replace(/ /g, '_')

function toCrowdField(question: string, id: string) {
  let type = getQuestionType(question)
  let handler = crowdElementMap[type]

  return trim(handler(question, id))
}

const assistOps: Op[] = ['mov']
const getOp = (code: string) => code.split(' ')[0] as Op

export function codeToCrowdField(line: string, ms = m()) {
  let id = toFormId(line)
  let question = toHuman(line, ms)

  return toCrowdField(question, id)
}

export function createCrowdFields(code: string, ms = m()) {
  function parseLine(line: string) {
    let result = codeToCrowdField(line, ms)
    ms = interpret(ms, line)

    return result
  }

  const result = toLines(code)
    .map(parseLine)
    .map(x => x.trim())
    .join('\n')

  return trim(result)
}

export function createMTurkXML(code: string) {
  const form = createCrowdFields(code)

  return MTurkXML(form)
}
