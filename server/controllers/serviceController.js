import Service from '../models/Service.js';

// @desc    Get all active services (Public)
// @route   GET /api/services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a service (Admin)
// @route   POST /api/services
export const createService = async (req, res) => {
  try {
    const { category, title, description, fee, processingTime } = req.body;
    
    if (!category || !title || !description) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const service = await Service.create({
      category,
      title,
      description,
      fee: fee || 'Free',
      processingTime: processingTime || 'N/A'
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete/Deactivate a service (Admin)
// @route   DELETE /api/services/:id
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // We deactivate instead of hard delete to keep historical request data intact
    service.isActive = false; 
    await service.save();
    
    res.json({ message: 'Service deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};