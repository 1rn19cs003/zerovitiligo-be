import 'dotenv/config';
import express from 'express';
import router from './src/routes/index.js';
import errorMiddleware from './src/middleware/error.js';
import prisma from './prisma.setup.js';

const app = express();
const port = process.env.PORT || 3000

app.use(express.json())

// Database connection test endpoint
app.get('/testPrismaConnection', async (_req, res) => {
  try {
    await prisma.$connect();
    res.status(200).json({
      success: true,
      message: '✅ Connected to database successfully!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Comprehensive health check endpoint
app.get('/health', async (_req, res) => {
  const healthCheck = {
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: {
      status: 'unknown',
      responseTime: 0
    }
  };

  try {
    const startTime = Date.now();
    
    await prisma.$queryRaw`SELECT 1`;
    const endTime = Date.now();
    
    healthCheck.database.status = 'connected';
    healthCheck.database.responseTime = `${endTime - startTime}ms`;
    
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.success = false;
    healthCheck.database.status = 'disconnected';
    healthCheck.error = error.message;
    
    res.status(503).json(healthCheck);
  }
});

// Ready check (for load balancers/k8s)
app.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Live check (for k8s liveness probe)
app.get('/live', (_req, res) => {
  res.status(200).json({
    status: 'live',
    timestamp: new Date().toISOString()
  });
});


app.use('/api', router);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})