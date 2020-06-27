import AWS from 'aws-sdk'

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',

  // @ts-ignore
  endpoint: 'https://mturk-requester-sandbox.us-east-1.amazonaws.com',
})

export const mTurk = new AWS.MTurk()

export async function getBalance() {
  const data = await mTurk.getAccountBalance().promise()

  return data.AvailableBalance
}

export async function createTask(question: string, maxTime: number = 120) {
  const task = {
    Title: 'answer these simple math questions',
    Description:
      'Answer this math problem. For example, answer 1 + 1 with 2. Feel free to use calculators.',
    Keywords: 'data collection, website, data extraction, math, simple math',
    AutoApprovalDelayInSeconds: 60 * 60,
    LifetimeInSeconds: 60 * 60,
    Question: question,
    AssignmentDurationInSeconds: maxTime,
    Reward: '0.4',
    MaxAssignments: 1,
  }

  const data = await mTurk.createHIT(task).promise()

  return data.HIT
}

interface Answer {
  instruction: string
  result: string
}

export function parseAnswer(answer: string = ''): Answer[] {
  const parser = new DOMParser()
  const xml = parser.parseFromString(answer, 'text/xml')

  const fields = Array.from(xml.querySelectorAll('Answer'))

  return fields.map(x => ({
    instruction: x.querySelector('QuestionIdentifier')?.textContent || '',
    result: x.querySelector('FreeText')?.textContent || '',
  }))
}

export async function getTaskAnswer(taskId: string) {
  const tasks = await mTurk.listAssignmentsForHIT({HITId: taskId}).promise()

  return tasks.Assignments?.filter(a => a.Answer).map(a => ({
    id: a.AssignmentId,
    answer: parseAnswer(a.Answer),
    status: a.AssignmentStatus,
  }))
}

export async function listTaskResults() {
  const tasks = await mTurk.listHITs().promise()
  if (!tasks.HITs) return

  const results = []

  for (let hit of tasks.HITs) {
    if (!hit.HITId) continue
    const answers = await getTaskAnswer(hit.HITId)

    results.push({id: hit.HITId, answers})
  }

  return results
}
