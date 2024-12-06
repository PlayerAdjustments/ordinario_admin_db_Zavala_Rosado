require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./src/routes');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
