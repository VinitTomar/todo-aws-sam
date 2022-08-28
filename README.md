# todo-aws-sam

## Setup

1. sam init
2. choose hello world template
3. choose nodejs runtime with typescript
4. rename hello-world folder to src
5. move `package.json` & `tsconfig.json` from src to root
6. Add build script to `package.json` => `sam deploy --stack-name prod --s3-bucket takshila-todo-app --capabilities CAPABILITY_IAM`
7. remove  `noEmit: false` from tsconfi.json 
8. remove metadat build method, update code uri to 'dist' from `templat.yml` file & replace `HelloWorld` with `GetTodos`
9. install `webpack`, `webpack-cli`, `typescript`, `ts-loader` as dev deps.
10. add `webpack.config.js` with required configuration.
11. Create s3 bucket for sam deploy cmd. (can be used sam deploy --guided)
12. Run command `yarn deploy`. 

## Create & list todos

1. Add `CreateTodoFunction` & `GetTodosFunction` function resource.
2. Add post api event to CreateTodoFunction resource & get api event to GetTodosFunction.
3. Add `TodoTable` simple table resource.
4. Add `DynamoDBCrudPolicy` policies to CreateTodoFunction.
5. Add `TODO_TABLE` to environment variables of both above function resource.

### File `src/app.ts` updates:

1. Add Todo interface & CreateTodo type.
2. Add dynamodb, randomUUID to imports.
3. Add `timeStamp` & `jsonResponse` utily functions.
4. Add `createTodo` function & `createTodoHandler` handler.
5. Add `getAllTodos` function & `getTodoListHandler` handler.

## Get by id

### File `src/app.ts`

1. Add `getTodoById` function. Params for dynamoDb client are tableName and key as an object with id property.
2. Add `getTodoByIdHandler` for getting todo by id. This handler gets the todo id from `event.pathParameters?.id`.

### File `templat.yaml`

1. Add `GetTodoByIdFunction` function resource.
2. Add an event of type `Api` to the above resource with `Path: /todos/{id}` with get method. Here id is the path paramter which is used by `getTodoByIdHandler`.
3. Add required dynamoDb policy and enivronment variables.

## Update todo

### File `src/app.ts`

1. Rename function `createTodo` to `putTodo` and add id as function parameter.
2. Move `const id: string = randomUUID();` to `createTodoHandler` and call putTodo in place of createTodo by passing id as argument.
3. Add `updateTodoHandler` for updating todo. This handler will call `putTodo` function and get todo id from `event.pathParameters?.id`.

### File `templat.yaml`

1. Add `UpdateTodoByIdFunction` function resource.
2. Add an event of type `Api` to the above resource with `Path: /todos/{id}` with put as method.
3. Add required dynamoDb policy and enivronment variables.