import express, { RequestHandler } from 'express';

const app = express();
const port = 3300;

const requestHandler: RequestHandler = (req, res) => {
  res.send('Hi');
};

app.get('/', requestHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port.toString()}`);
});
