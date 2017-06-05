import AWS from 'aws-sdk'

AWS.config.update({
  region: 'us-west-2',
})

const ses = new AWS.SES()

export const sendEmail = async () => {
  const emailParams = {
    Destination: {
      ToAddresses: ['benny_wang200@hotmail.com'],
    },
    Message: {
      Body: {
        Text: {
          Data: 'this is body data',
        },
      },
      Subject: {
        Data: 'this is subject data',
      },
    },
    Source: 'bennywang200@gmail.com',
  }

  await ses.sendEmail(emailParams, (err, data) => {
    if (err) {
      return null
    }

    return data
  })
}

export default {}
