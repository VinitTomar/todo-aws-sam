import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { docClient, jsonResponse, lambdaWrapper, tableName } from "@util/helper";


const getAllTodos = async (): Promise<Todo[]> => {
  const params: DocumentClient.ScanInput = {
    TableName: tableName,
  }
  const data = await docClient.scan(params).promise();
  const list: Todo[] = <[]>data.Items;
  return list;
}

export const getTodoListHandler = lambdaWrapper(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("getTodoListHandler", event);
  const allTodo = await getAllTodos();
  return jsonResponse(200, allTodo);
});