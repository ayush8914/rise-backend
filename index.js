require('dotenv').config();
const experss = require('express');
const BodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./DB/connect');
const userRoutes = require('./Routes/userRoutes');
const projectRoutes = require('./Routes/projectRoutes');
const inspectionRoutes = require('./Routes/inspectionRoutes');

// const jwt = require('jsonwebtoken');
// const asyncHandler = require('express-async-handler');
// const User = require('./models/user');


const app = experss();
const PORT = process.env.PORT || 5000;



// Middlewares
app.use(cors());
app.use(BodyParser.json());
app.use(experss.static('public'));

app.get('/', (req, res) => { res.send('Hello World') ; res.end();});
app.use('/api', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/inspections', inspectionRoutes);

const start = async () => {
        try {
            await connectDB(process.env.MONGODB_URI);
            app.listen(PORT, () => { console.log(`Server is running on PORT ${PORT}`) });  
        } catch (error) {
            console.log(error);
        }
};


start();
