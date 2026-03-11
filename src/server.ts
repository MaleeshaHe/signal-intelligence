import app from './app';

const PORT = process.env.PORT || 3000;

(async () => {
  const server = app.listen(PORT, () => {
    console.log(`Signal Intelligence API running on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`API:    http://localhost:${PORT}/api`);

    if (process.send) {
      process.send('ready');
    }
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
      server.close();
    }
  });
})();
