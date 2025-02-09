const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all catalog items
router.get('/', async (req, res) => {
  try {
    const items = await prisma.catalogItem.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching catalog items' });
  }
});

// Add new catalog item
router.post('/', async (req, res) => {
  try {
    const { description, model, unit, price, notes } = req.body;

    const item = await prisma.catalogItem.create({
      data: {
        description,
        model,
        unit,
        price: parseFloat(price),
        notes,
        companyId: req.user.companyId // This will be set by auth middleware
      }
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error creating catalog item' });
  }
});

module.exports = router;