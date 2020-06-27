import {createTask} from './MTurk'
import {generateQuestionXMLFromCode} from './MTurkPayload'
import {getHumanTimeLimit} from './SkynetCostOptimizer'
import {saveTask} from './Persist'

export async function createHumanTaskFromCode(code: string) {
  const questionXML = generateQuestionXMLFromCode(code)
  const humanTimeLimit = getHumanTimeLimit(code)

  const task = await createTask(questionXML, humanTimeLimit)
  if (!task) return

  if (task) saveTask(task, code)

  return task
}
