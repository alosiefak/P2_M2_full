import path from 'path';
import express, { json, Request, Response } from 'express';
import cors from 'cors';
import * as OpenApiValidator from 'express-openapi-validator';
import { 
    createEnvironment, 
    listEnvironments, 
    markEnvironmentForDeletion, 
    deleteEnvironment 
} from './services/dynamodb';

const app = express();
const port = process.env.PORT || 3457;

app.use(cors());
app.use(json());

app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.use(
  OpenApiValidator.middleware({
    apiSpec: path.join(__dirname, '../openapi.yaml'),
    validateRequests: true,
    validateResponses: true,
  })
);

app.get('/healthz', (_: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Health check passed' });
});

app.post('/environments', async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        await createEnvironment(name);
        res.status(202).json({ message: 'Environment creation accepted' });
    } catch (error: any) {
        if (error.name === 'ConditionalCheckFailedException') {
            res.status(409).json({ error: 'Environment already exists' });
            return;
        }
        console.error('Failed to create environment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/environments', async (_: Request, res: Response) => {
    try {
        const environments = await listEnvironments();
        res.json(environments);
    } catch (error) {
        console.error('Failed to list environments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/environments/:name', async (req: Request, res: Response) => {
    try {
        const { name } = req.params;
        await markEnvironmentForDeletion(name);
        // Start async deletion process
        deleteEnvironment(name).catch(error => {
            console.error(`Failed to delete environment ${name}:`, error);
        });
        res.status(202).json({ message: 'Environment deletion accepted' });
    } catch (error) {
        console.error('Failed to mark environment for deletion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

function signalHandler(signal: string) {
  console.log(`${signal} received. Shutting down.`);
  server.close(() => {
    console.log('Express server closed. Exiting.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => signalHandler('SIGTERM'));
process.on('SIGINT', () => signalHandler('SIGINT'));

process.on('warning', (e: Error) => console.error(e.stack));
