import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { randomUUID } from "crypto";
import { tableName, docClient, timeStamp } from "./helper";

export const putTodo = async (todo: UpdateTodo, id?: string): Promise<PutTodo> => {

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