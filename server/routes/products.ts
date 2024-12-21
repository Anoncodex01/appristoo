import express from 'express';
import { ProductSchema, createProduct, getProducts, getProductById } from '../models/product';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const input = ProductSchema.parse(req.body);
    const productId = await createProduct(input);
    res.status(201).json({ id: productId });
  } catch (error) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;