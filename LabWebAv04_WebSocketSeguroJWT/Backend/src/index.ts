import WebSocket, { WebSocketServer } from 'ws';
import https from 'https';
import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import url from 'url';

const app = express();

// Create a secret to be used for signing the JWTs.
const jwtSecret: string = "example-secret";

// Define interfaces
interface UserCredential {
    username: string;
    password: string;
    userId: number;
    userInfo: string;
}

interface CustomJwtPayload extends JwtPayload {
    sub: string;
    username: string;
}

// Create an array with user login credentials and information.
// Typically, you would store this information in a database,
// and the passwords would be stored encrypted.
const userCredentials: UserCredential[] = [
    {
        "username": "maxcarrion31",
        "password": "1234",
        "userId": 1,
        "userInfo": "I am maxcarrion31."
    },
    {
        "username": "maxcarrion32",
        "password": "1234",
        "userId": 2,
        "userInfo": "I am maxcarrion32."
    },
    {
        "username": "userC",
        "password": "passwordC",
        "userId": 3,
        "userInfo": "I am userC."
    }
];

// SSL credentials
const server = https.createServer({
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem')
}, app);

// Define the WebSocket server. Here, the server mounts to the `/ws`
// route of the Express JS server.
const wss = new WebSocketServer({ server: server, path: '/ws' });

// Create an empty list that can be used to store WebSocket clients.
const wsClients: { [token: string]: WebSocket } = {};

// Handle the WebSocket `connection` event. This checks the request URL
// for a JWT. If the JWT can be verified, the client's connection is added;
// otherwise, the connection is closed.
wss.on('connection', (ws: WebSocket, req: any) => {
  const token: string = url.parse(req.url, true).query.token as string;
  let wsUsername: string = "";
  jwt.verify(token, jwtSecret, (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err) {
          ws.close();
      } else if (decoded && typeof decoded === 'object' && 'username' in decoded) {
          wsClients[token] = ws;
          wsUsername = (decoded as CustomJwtPayload).username;
          console.log('Client name connected: ' + wsUsername);
      } else {
          ws.close();
      }
  });

  // Handle the WebSocket `message` event. If any of the clients has a token
  // that is no longer valid, send an error message and close the client's
  // connection.
  ws.on('message', (data: WebSocket.Data) => {
      for (const [token, client] of Object.entries(wsClients)) {
          jwt.verify(token, jwtSecret, (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
              if (err) {
                  client.send("Error: Your token is no longer valid. Please reauthenticate.");
                  client.close();
              } else {
                  client.send(wsUsername + ": " + data);
              }
          });
      }
  });
});

app.use(express.static(path.join(__dirname, '../../Frontend')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../Frontend', 'index.html'));
});

// Create an endpoint for authentication.
app.get('/auth', (req: Request, res: Response) => {
  res.send(fetchUserToken(req));
});

// Check request credentials, and create a JWT if there is a match.
const fetchUserToken = (req: Request): string => {
  for (let i = 0; i < userCredentials.length; i++) {
      if (userCredentials[i].username === req.query.username
          && userCredentials[i].password === req.query.password) {          return jwt.sign(
              {
                  "sub": userCredentials[i].userId.toString(),
                  "username": req.query.username as string
              },
              jwtSecret,
              { expiresIn: 900 } // Expire the token after 15 minutes.
          );
      }
  }

  return "Error: No matching user credentials found.";
}

// Fetch the user information matching the user ID in the request.
const fetchUserInfo = (userId: number): string => {
  for (let i = 0; i < userCredentials.length; i++) {
      if (userCredentials[i].userId === userId) {
          return userCredentials[i].userInfo;
      }
  }

  return "Error: Unable to fulfill the request.";
}

// Add an endpoint for user information requests. The endpoint first
// verifies the JWT. If it is valid, it makes the call to fetch the
// user's information.
app.get('/userInfo', (req: Request, res: Response) => {
  jwt.verify(req.query.token as string, jwtSecret, (err: jwt.VerifyErrors | null, decodedToken: string | JwtPayload | undefined) => {
      if (err) {
          res.send(err);
      } else if (decodedToken && typeof decodedToken === 'object' && 'sub' in decodedToken) {
          res.send(fetchUserInfo(parseInt((decodedToken as CustomJwtPayload).sub)));
      } else {
          res.send("Error: Invalid token format.");
      }
  });
});

server.listen(5000, () => {
  console.log('WebSocket Server running on https://localhost:5000');
});
