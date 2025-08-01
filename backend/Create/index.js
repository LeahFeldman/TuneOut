const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Simple ID generator
const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  let body;

  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const { name, author, songs } = body;

  if (!name || !author || !Array.isArray(songs)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing or invalid 'name', 'author', or 'songs'" }),
    };
  }

  const playlistId = generateId();

  const params = {
    TableName: "tune_out",
    Item: {
      pk: playlistId,
      name,
      author,
      songs,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamo.send(new PutCommand(params));
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        message: `Playlist '${name}' by ${author} added successfully.`,
        id: playlistId,
        songs,
      }),
    };
  } catch (err) {
    console.error("DynamoDB error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not save playlist" }),
    };
  }
};