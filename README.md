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