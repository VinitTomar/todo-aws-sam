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

const getAllTodos = async (): Promise<Todo[]> => {
  const params: DocumentClient.ScanInput = {
    TableName: tableName,
  }

  const data = await docClient.scan(params).promise();
  const list: Todo[] = <[]>data.Items;
  return list;
}

// const getTodoById = async (id: string): Promise<Todo> {

// }

const timeStamp = () => {
  return Date().split(' (')[0];
}

const jsonResponse = (status: number, body: unknown): APIGatewayProxyResult => {
  return {
    statusCode: status,
    body: JSON.stringify(body),
  };
}

const createTodo = async (todo: CreateTodo): Promise<Todo> => {
  const id = randomUUID();

  const item: Todo = {
    id,
    ...todo,
    createdAt: timeStamp(),
    updatedAt: timeStamp(),
  }

  const params: DocumentClient.PutItemInput = {
    TableName: tableName,
    Item: item
  }

  const result = await docClient.put(params).promise();

  console.log("createTodo result ", { result });

  return item;
}

// const updateTodo = async (id: string, todo: UpdateTodo): Promise<Todo> {

// }

// const patchTodo = async (id: string, todo: PatchTodo): Promise<Todo> {

// }

// const deleteTodo = async (id: string): Promise<string> {

// }


export const getTodoListHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log("getTodoListHandler", event);
  let response: APIGatewayProxyResult;

  try {
    const allTodo = await getAllTodos();
    console.log("getTodoListHandler", { allTodo });
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

export const createTodoHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log("createTodoHandler", event);
  let response: APIGatewayProxyResult;

  try {
    const todo: CreateTodo = JSON.parse(event.body || '{}');
    const newTodo = await createTodo(todo);
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
