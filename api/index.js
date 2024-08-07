import express, { static } from 'express';
const app = express();
app.use(static('../dict'));

export default app;