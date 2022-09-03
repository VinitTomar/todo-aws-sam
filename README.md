# todo-aws-sam

## Final

1. Code separated into different respect of their jobs.
2. `webpack.config.js` updated for dynamic entry point.
3. Added util folder and types.d.ts
4. Updated `templat.yaml`
5. Move eslint files, .npmignore, jest config file, prettierrc.js to the root

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

### File `template.yaml`

1. Add `GetTodoByIdFunction` function resource.
2. Add an event of type `Api` to the above resource with `Path: /todos/{id}` with get method. Here id is the path paramter which is used by `getTodoByIdHandler`.
3. Add required dynamoDb policy and enivronment variables.

## Update todo

### File `src/app.ts`

1. Rename function `createTodo` to `putTodo` and add id as function parameter.
2. Move `const id: string = randomUUID();` to `createTodoHandler` and call putTodo in place of createTodo by passing id as argument.
3. Add `updateTodoHandler` for updating todo. This handler will call `putTodo` function and get todo id from `event.pathParameters?.id`.

### File `template.yaml`

1. Add `UpdateTodoByIdFunction` function resource.
2. Add an event of type `Api` to the above resource with `Path: /todos/{id}` with put as method.
3. Add required dynamoDb policy and enivronment variables.

> Bug fix for updateTodoHanler. At the time of updation, createdAt value was also updated.
> To fix this id param of putTodo function is made option and `PutTodo` type is added.
> Due to change in putTodo function, we have to updated createTodoHandler.

## Patch todo

### File `src/app.ts`

1. Add `patchTodoHandler` handler for partially updating todo.
2. Add `pathcTodo` function. This will update todo by using `UpdateExpression`, which is genereated dyamically.

### File `template.yaml`

1. Add `PatchTodoByIdFunction` function resource.
2. Add an event of type `Api` to the above resource with `Path: /todos/{id}` with patch as method.
3. Add required dynamoDb policy and enivronment variables.

## Delete todo

1. Add `deleteTodoHandler` and `deleteTodo` fucntion to app.ts file.
2. Inside deleteTodo fucntion call `delete` method of `docClient` to delete a todo.
3. Add `DeleteTodoByIdFunction` function resource to template.yaml file, with Api event.
4. This api event will have path set to `/todos/{id}` and method as Delete.