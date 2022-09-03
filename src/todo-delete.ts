import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { tableName, docClient, jsonResponse, lambdaWrapper } from "./util/helper";


const deleteTodo = async (id: string) => {
  const params: DocumentClient.DeleteItemInput = {
    TableName: tableName,
    Key: { id }
  }

  return docClient.delete(params).promise();
}

export const updateTodoHandler = lambdaWrapper(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("patchTodoHandler", event);
  const updatedTodo = await deleteTodo(event.pathParameters?.id || '');
  return jsonResponse(200, updatedTodo);
});