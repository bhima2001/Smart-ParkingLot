import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
    console.log(port, host);
    console.log(`Server is running on http://${host}:${port}`);
});