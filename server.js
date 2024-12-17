const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const PORT = process.env.PORT || 7000;
const connectDB = require('./config/database');

require('dotenv').config();

const app = express();

morgan.token('req-body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});
morgan.token('method', (req) => req.method);
morgan.token('url', (req) => req.url);
morgan.token('status', (req, res) => res.statusCode);
const customFormat =
  ':method :url :status :res[content-length] :response-time ms - :req-body';

app.set('trust proxy', true);

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan(customFormat));

connectDB();

app.get('/', (req, res) => {
  res.send('hello boluwatife');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is up and running!',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT} ..betta go catch it🏃`
  );
});
