import express from 'express';
import CelebrityRoutes from './Routes/CelebrityRoutes';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3460;

// Api routes
app.use('/api', CelebrityRoutes);

app.listen(port, () => console.log(`Server is listening on port ${port}!`));
