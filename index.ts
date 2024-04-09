import dotenv from 'dotenv';
import express from 'express';
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
