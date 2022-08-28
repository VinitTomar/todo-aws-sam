import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import dynamodb, { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { randomUUID } from 'crypto';

const docClient = new dynamodb.DocumentClient();
const tableName = process.env.TODO_TABLE;;

interface Todo {
  id: string;
  name: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
  updatedAt: string;
}

type CreateTodo = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateTodo = CreateTodo;
type PatchTodo = Partial<CreateTodo>;
type PutTodo = Optional<Todo, 'createdAt'>;
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

const timeStamp = () => {
  return Date().split(' (')[0];
}

const jsonResponse = (status: number, body: unknown): APIGatewayProxyResult => {
  return {
    statusCode: status,
    body: JSON.stringify(body),
  };
}

const getAllTodos = async (): Promise<Todo[]> => {
  const params: DocumentClient.ScanInput = {
    TableName: tableName,
  }

  const data = await docClient.scan(params).promise();
  const list: Todo[] = <[]>data.Items;
  return list;
}

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

const putTodo = async (todo: UpdateTodo, id?: string): Promise<PutTodo> => {

  const item: PutTodo = {
    id: id ? id : randomUUID(),
    ...todo,
    createdAt: timeStamp(),
    updatedAt: timeStamp(),
  };

  if (!id) {
    delete item.createdAt;
  }

  const params: DocumentClient.PutItemInput = {
    TableName: tableName,
    Item: item
  }

  const result = await docClient.put(params).promise();

  console.log("putTodo result ", { result });

  return item;
}

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

const deleteTodo = async (id: string) => {
  const params: DocumentClient.DeleteItemInput = {
    TableName: tableName,
    Key: { id }
  }

  return docClient.delete(params).promise();
}


export const getTodoListHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log("getTodoListHandler", event);
  let response: APIGatewayProxyResult;

  try {
    const allTodo = await getAllTodos();
    response = jsonResponse(200, allTodo);
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    };
  }

  return response;
};

export const getTodoByIdHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log("getTodoByIdHandler", event);
  let response: APIGatewayProxyResult;

  try {
    const todo = await getTodoById(event.pathParameters?.id || '');
    response = jsonResponse(200, todo);
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    };
  }

  return response;
};

export const createTodoHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log("createTodoHandler", event);
  let response: APIGatewayProxyResult;

  try {
    const todo: CreateTodo = JSON.parse(event.body || '{}');
    const newTodo = await putTodo(todo);
    response = jsonResponse(201, newTodo);
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    };
  }

  return response;

};

export const updateTodoHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log("updateTodoHandler", event);
  let response: APIGatewayProxyResult;

  try {
    const todo: UpdateTodo = JSON.parse(event.body || '{}');
    const updatedTodo = await putTodo(todo, event.pathParameters?.id || '');
    response = jsonResponse(200, updatedTodo);
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    };
  }

  return response;

};

export const patchTodoHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log("patchTodoHandler", event);
  let response: APIGatewayProxyResult;

  try {
    const todo: PatchTodo = JSON.parse(event.body || '{}');
    const updatedTodo = await patchTodo(event.pathParameters?.id || '', todo);
    response = jsonResponse(200, updatedTodo);
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    };
  }

  return response;

};

export const deleteTodoHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log("patchTodoHandler", event);
  let response: APIGatewayProxyResult;

  try {
    const updatedTodo = await deleteTodo(event.pathParameters?.id || '');
    response = jsonResponse(200, updatedTodo);
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    };
  }

  return response;

};
