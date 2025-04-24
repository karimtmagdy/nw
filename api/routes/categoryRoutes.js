const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/categories
// @desc    Create a category
// @access  Private/Admin
router.post('/', [auth, admin], async (req, res) => {
  try {
    const { name, description, image } = req.body;
    
    // Check if category already exists
    let category = await Category.findOne({ name });
    
    if (category) {
      return res.status(400).json({ msg: 'Category already exists' });
    }
    
    // Create new category
    category = new Category({
      name,
      description,
      image
    });
    
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;
    
    // Build category object
    const categoryFields = {};
    if (name) categoryFields.name = name;
    if (description) categoryFields.description = description;
    if (image) categoryFields.image = image;
    if (isActive !== undefined) categoryFields.isActive = isActive;
    
    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    // Update
    category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: categoryFields },
      { new: true }
    );
    
    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    await category.remove();
    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;