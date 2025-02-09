const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all quotes
router.get('/', async (req, res) => {
  try {
    const quotes = await prisma.quote.findMany({
      include: {
        items: true
      }
    });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching quotes' });
  }
});

// Create new quote
router.post('/', async (req, res) => {
  try {
    const { title, items, companyName, contactName, contactPhone, contactEmail } = req.body;

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const vat = subtotal * 0.18; // 18% VAT
    const total = subtotal + vat;

    const quote = await prisma.quote.create({
      data: {
        quoteNumber: await generateQuoteNumber(),
        title,
        companyName,
        contactName,
        contactPhone,
        contactEmail,
        subtotal,
        vat: 18,
        total,
        items: {
          create: items.map((item, index) => ({
            itemNumber: index + 1,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price
          }))
        }
      },
      include: {
        items: true
      }
    });

    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: 'Error creating quote' });
  }
});

// Generate quote number
async function generateQuoteNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  const count = await prisma.quote.count({
    where: {
      createdAt: {
        gte: new Date(date.getFullYear(), date.getMonth(), 1),
        lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
      }
    }
  });

  return `${year}${month}-${String(count + 1).padStart(3, '0')}`;
}

module.exports = router;