const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = async () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const data = await dynamodb.scan({ TableName: 'tune_out' }).promise();

  const recent = data.Items.filter(p => new Date(p.createdAt) >= oneWeekAgo);

  let message = '';
  if (recent.length > 0) {
    message = "🎧 New playlists this week:\n\n" +
      recent.map(p => `• ${p.name}`).join('\n');
  } else {
    message = `🎶 No new playlists—why not make one?`;
  }

  message += `\n\n👉 Click here to view or add playlists: https://main.df5m60ph99c5w.amplifyapp.com/`;

  await sns.publish({
    Message: message,
    TopicArn: process.env.WEEKLY_TOPIC_ARN,
  }).promise();
};
