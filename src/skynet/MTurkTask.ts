import {createTask} from './MTurk'
import {generateQuestionXMLFromCode} from './MTurkPayload'
import {getHumanTimeLimit} from './SkynetCostOptimizer'

export async function createHumanTaskFromCode(code: string) {
  const questionXML = generateQuestionXMLFromCode(code)
  const humanTimeLimit = getHumanTimeLimit(code)

  return createTask(questionXML, humanTimeLimit)
}
