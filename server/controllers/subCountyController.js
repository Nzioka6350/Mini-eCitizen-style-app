import SubCounty from '../models/SubCounty.js';

// @desc    Get all active sub-counties (Public)
// @route   GET /api/subcounties
export const getSubCounties = async (req, res) => {
  try {
    const subCounties = await SubCounty.find({ isActive: true }).sort({ name: 1 });
    res.json(subCounties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a sub-county (Admin)
// @route   POST /api/subcounties
export const createSubCounty = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const exists = await SubCounty.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Sub-county already exists' });

    const subCounty = await SubCounty.create({ name });
    res.status(201).json(subCounty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Deactivate sub-county (Admin)
// @route   DELETE /api/subcounties/:id
export const deleteSubCounty = async (req, res) => {
  try {
    const subCounty = await SubCounty.findById(req.params.id);
    if (!subCounty) return res.status(404).json({ message: 'Sub-county not found' });

    subCounty.isActive = false;
    await subCounty.save();
    res.json({ message: 'Sub-county removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};