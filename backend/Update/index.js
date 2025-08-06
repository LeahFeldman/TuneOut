const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "tune_out";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,DELETE"

};

exports.handler = async (event) => {
  console.log("Incoming event:", JSON.stringify(event, null, 2));

  // if (event?.httpMethod === "OPTIONS") {
  //   return {
  //     statusCode: 200,
  //     headers: CORS_HEADERS,
  //     body: "",
  //   };
  // }

  if (event?.httpMethod && event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const { playlistId, title, artist, duration } = JSON.parse(event.body);

    if (!playlistId || !title || !artist || !duration) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          message: "Missing required fields: playlistId, title, artist, duration",
        }),
      };
    }

    const newSong = { title, artist, duration };

    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: { pk: playlistId },
    });

    const { Item: playlist } = await ddbDocClient.send(getCommand);

    if (!playlist) {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: `Playlist with ID ${playlistId} not found.` }),
      };
    }

    const updatedSongs = [...(playlist.songs || []), newSong];

    const updateCommand = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { pk: playlistId },
      UpdateExpression: "SET songs = :songs",
      ExpressionAttributeValues: {
        ":songs": updatedSongs,
      },
      ReturnValues: "ALL_NEW",
    });

    const { Attributes: updatedPlaylist } = await ddbDocClient.send(updateCommand);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: "Song added to playlist successfully!",
        playlist: updatedPlaylist,
      }),
    };
  } catch (err) {
    console.error("Error adding song to playlist:", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: "Failed to add song to playlist.",
        error: err.message,
      }),
    };
  }
};