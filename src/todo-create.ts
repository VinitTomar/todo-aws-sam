import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { putTodo } from "@util/todo-put";
import { lambdaWrapper, jsonResponse } from "@util/helper";


export const createTodoHandler = lambdaWrapper(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("createTodoHandler", event);
  const todo: CreateTodo = JSON.parse(event.body || '{}');
  const newTodo = await putTodo(todo);
  return jsonResponse(201, newTodo);
});
