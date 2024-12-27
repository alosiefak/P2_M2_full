import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
    DynamoDBDocumentClient, 
    PutCommand, 
    GetCommand, 
    ScanCommand,
    UpdateCommand,
    DeleteCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'Environments';

export interface Environment {
    name: string;
    status: 'CREATING' | 'ACTIVE' | 'MARKED' | 'DELETING' | 'ERROR';
    createdAt: string;
}

export async function createEnvironment(name: string): Promise<Environment> {
    const environment: Environment = {
        name,
        status: 'CREATING',
        createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: environment,
        ConditionExpression: 'attribute_not_exists(#name)',
        ExpressionAttributeNames: {
            '#name': 'name'
        }
    }));

    return environment;
}

export async function listEnvironments(): Promise<Environment[]> {
    const response = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME
    }));

    return (response.Items || []) as Environment[];
}

export async function markEnvironmentForDeletion(name: string): Promise<void> {
    await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { name },
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeNames: {
            '#status': 'status'
        },
        ExpressionAttributeValues: {
            ':status': 'MARKED'
        }
    }));
}

export async function deleteEnvironment(name: string): Promise<void> {
    await docClient.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { name }
    }));
} 