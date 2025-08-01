const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });

exports.handler = async (event) => {
  const playlistId = event?.queryStringParameters?.playlistId;

  if (!playlistId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing playlistId in query parameters" }),
    };
  }

  const params = {
    TableName: "tune_out",
    Key: {
      pk: { S: playlistId }, // Explicit type for low-level client
    },
  };

  try {
    await client.send(new DeleteItemCommand(params));
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ message: "Item deleted successfully" }),
    };
  } catch (err) {
    console.error("Error deleting item from DynamoDB", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error deleting item from DynamoDB" }),
    };
  }
};