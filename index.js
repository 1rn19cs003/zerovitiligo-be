import 'dotenv/config';
import express from 'express';
import { PrismaClient } from './generated/prisma/index.js'; 
import router from './src/routes/index.js';



const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})



const app = express();
const port = process.env.PORT || 3000

app.use(express.json())


app.get('/testPrismaConnection', async (_req, res) => {
  try {
    await prisma.$connect();
    res.status(200).json({
      message: '✅ Connected to database successfully!'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})