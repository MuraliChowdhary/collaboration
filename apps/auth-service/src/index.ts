import app from './app';
import 'dotenv/config';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.listen(PORT, '0.0.0.0', () => {  // Binding to 0.0.0.0 makes it accessible externally
  console.log(`🚀 Auth service running on port ${PORT}`);
});
