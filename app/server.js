import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser'; 

const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json()); 

const PORT = process.env.PORT || 3001;


app.post('/api/wishlist', (req, res) => {
    const { productId, variantId } = req.body; 
    console.log(`Product ID: ${productId}, Variant ID: ${variantId}`);
    res.status(200).json({ message: 'Data received successfully', productId, variantId });
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});