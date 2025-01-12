export const isDevelopment = import.meta.env.DEV;

// Parse the ADO.NET connection string to extract components
const parseConnectionString = (connStr: string) => {
  const params = new URLSearchParams(
    connStr.split(';').map(pair => {
      const [key, value] = pair.split('=');
      return [key, value];
    })
  );

  return {
    host: params.get('Server')?.split(',')[0].replace('tcp:', '') || '',
    database: params.get('Initial Catalog') || '',
    ssl: params.get('Encrypt') === 'True',
    connectionTimeout: parseInt(params.get('Connection Timeout') || '30', 10)
  };
};

const connectionParams = parseConnectionString(
  'Server=tcp:tender-tracking-server.database.windows.net,1433;Initial Catalog=tender-tracking-db;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;Authentication="Active Directory Default";'
);

export const dbConfig = {
  host: connectionParams.host,
  database: connectionParams.database,
  // Use environment variables for sensitive data
  user: process.env.VITE_AZURE_DB_USER || '',
  password: process.env.VITE_AZURE_DB_PASSWORD || '',
  port: 5432, // Standard PostgreSQL port
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: connectionParams.connectionTimeout * 1000,
  query_timeout: 30000,
  // Add connection pool configuration
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  keepAlive: true, // Keep connections alive
  keepAliveInitialDelayMillis: 10000 // Initial delay before starting keepalive
};