const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().populate('category', 'name');
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/services/category/:categoryId
// @desc    Get services by category
// @access  Public
router.get('/category/:categoryId', async (req, res) => {
  try {
    const services = await Service.find({ 
      category: req.params.categoryId,
      inStock: true 
    }).populate('category', 'name');
    
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('category', 'name');
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    res.json(service);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/services
// @desc    Create a service
// @access  Private/Admin
router.post('/', [auth, admin], async (req, res) => {
  try {
    const { name, description, price, category, image, inStock, featured } = req.body;
    
    // Create new service
    const newService = new Service({
      name,
      description,
      price,
      category,
      image,
      inStock,
      featured
    });
    
    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/services/:id
// @desc    Update a service
// @access  Private/Admin
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const { name, description, price, category, image, inStock, featured } = req.body;
    
    // Build service object
    const serviceFields = {};
    if (name) serviceFields.name = name;
    if (description) serviceFields.description = description;
    if (price) serviceFields.price = price;
    if (category) serviceFields.category = category;
    if (image) serviceFields.image = image;
    if (inStock !== undefined) serviceFields.inStock = inStock;
    if (featured !== undefined) serviceFields.featured = featured;
    
    let service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    // Update
    service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: serviceFields },
      { new: true }
    );
    
    res.json(service);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/services/:id
// @desc    Delete a service
// @access  Private/Admin
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    await service.remove();
    res.json({ msg: 'Service removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;