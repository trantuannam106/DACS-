require('dotenv').config();
const express = require('express');
const moogse = require('mongoose');
const authRouter = require('./routes/auth');

const connectDB = async () => {
    try {
        await moogse.connect(process.env.MONGO_URI || '');
        console.log('✅ Kết nối MongoDB thành công');
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error);
        process.exit(1);
    }   
}
connectDB()
const app = express();
app.use(express.json()) ;

app.use('/api/auth',authRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  });
  