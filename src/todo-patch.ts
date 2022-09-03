import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { timeStamp, tableName, docClient, jsonResponse, lambdaWrapper } from "./util/helper";


const patchTodo = async (id: string, todo: PatchTodo) => {
  let UpdateExpression = 'set ';
  let ExpressionAttributeNames: any = {};
  let ExpressionAttributeValues: any = {};

  for (const key in todo) {
    if (key !== 'name' && key !== 'description' && key !== 'status')
      continue;

    UpdateExpression += `#${key} = :${key}, `;
    ExpressionAttributeNames[`#${key}`] = key;
    ExpressionAttributeValues[`:${key}`] = todo[key];
  }

  UpdateExpression += `updatedAt = :updatedAt`;
  ExpressionAttributeValues[':updatedAt'] = timeStamp();

  console.log({ UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues })

  const params: DocumentClient.UpdateItemInput = {
    TableName: tableName,
    Key: { id },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  }

  return await docClient.update(params).promise();

}

export const updateTodoHandler = lambdaWrapper(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("patchTodoHandler", event);
  const todo: PatchTodo = JSON.parse(event.body || '{}');
  const updatedTodo = await patchTodo(event.pathParameters?.id || '', todo);
  return jsonResponse(200, updatedTodo);
});