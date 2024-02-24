const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./config/database').dbConnect();
// Middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.use('/codac', require('./router/user'));

const PORT = 4000 ;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('<h1>Codac</h1>');
});
