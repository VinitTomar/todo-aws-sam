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
type LambdaHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;
type LambdaWrapper = (handler: LambdaHandler) => LambdaHandler;