const errorMiddleware = (error, req, res, next) => {
  console.error('Error:', error.message);
  
  if (error.code === 'P2002') {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered'
    });
  }
  
  if (error.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found'
    });
  }
  
  // Default error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error'
  });
};

export default errorMiddleware;