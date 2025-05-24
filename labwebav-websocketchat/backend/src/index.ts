import express, { Express, Request, Response } from 'express';

const app: Express = express();
const PORT: number = 3000;


app.use(express.json());


interface User { id: number; name: string; email: string }
let users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob',   email: 'bob@example.com' }
];


app.get('/api/users', (req: Request, res: Response): void => {
    res.json(users);
});

app.get('/api/users/:id', (req: Request, res: Response): void => {
    const id = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.post('/api/users', (req: Request, res: Response): void => {
    const { name, email } = req.body as { name: string; email: string };
    const newUser: User = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.listen(PORT, (): void => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});