import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import dynamodb from 'aws-sdk/clients/dynamodb';

export const docClient = new dynamodb.DocumentClient();

export const tableName = process.env.TODO_TABLE;

export const timeStamp = () => {
  return Date().split(' (')[0];
}

export const jsonResponse = (status: number, body: unknown): APIGatewayProxyResult => {
  return {
    statusCode: status,
    body: JSON.stringify(body),
  };
}

export const lambdaWrapper: LambdaWrapper = (handler) => {
  return async (event: APIGatewayProxyEvent) => {
    let response: APIGatewayProxyResult;

    try {
      response = await handler(event);
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
  }
}