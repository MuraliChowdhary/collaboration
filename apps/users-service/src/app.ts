import app from './index';
import { config } from 'dotenv';

config();

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Users service running on port ${PORT}`);
});
