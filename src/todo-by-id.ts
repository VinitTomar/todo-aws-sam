import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { docClient, jsonResponse, lambdaWrapper, tableName } from "./util/helper";


const getTodoById = async (id: string): Promise<Todo> => {
  const params: DocumentClient.GetItemInput = {
    TableName: tableName,
    Key: {
      id
    }
  };

  const data = await docClient.get(params).promise();
  const todo: Todo = <any>data.Item;

  return todo;
}

export const getTodoByIdHandler = lambdaWrapper(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("getTodoByIdHandler", event);
  const todo = await getTodoById(event.pathParameters?.id || '');
  return jsonResponse(200, todo);
});
