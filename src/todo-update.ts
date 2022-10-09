import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { putTodo } from "@util/todo-put";
import { lambdaWrapper, jsonResponse } from "@util/helper";


export const updateTodoHandler = lambdaWrapper(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("updateTodoHandler", event);
  const todo: UpdateTodo = JSON.parse(event.body || '{}');
  const updatedTodo = await putTodo(todo, event.pathParameters?.id || '');
  return jsonResponse(200, updatedTodo);
});