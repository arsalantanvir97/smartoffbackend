import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import connectDB from  './config/db.js';
import authRoutes from './routes/authRoutes.js'

dotenv.config()

connectDB()
const app = express()
app.use(cors());
app.options('*', cors());
app.use(express.json())

app.use('/api/auth', authRoutes)


app.get('/', (req, res) => {
  res.send('API is running....')
})



app.listen(5000, console.log('Server running on port 5000'))