const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "us-east-1" });

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,DELETE"
};

exports.handler = async (event) => {
  if (event?.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: ""
    };
  }

  const playlistId = event?.queryStringParameters?.playlistId;
  if (!playlistId) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Missing playlistId in query parameters" }),
    };
  }

  const params = {
    TableName: "tune_out",
    Key: {
      pk: { S: playlistId },
    },
  };

  try {
    await client.send(new DeleteItemCommand(params));
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Item deleted successfully" }),
    };
  } catch (err) {
    console.error("Error deleting item from DynamoDB", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Error deleting item from DynamoDB" }),
    };
  }
};
