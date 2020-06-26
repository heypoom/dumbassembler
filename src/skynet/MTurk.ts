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
    Reward: '0.1$',
    MaxAssignments: 1,
  }

  const data = await mTurk.createHIT(task).promise()

  return data.HIT
}
