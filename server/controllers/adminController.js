import ServiceRequest from '../models/ServiceRequest.js';
import RequestHistory from '../models/RequestHistory.js';
import User from '../models/User.js'; 

// @desc    Get all requests (Admin/Officer)
// @route   GET /api/admin/requests
// @access  Private (Admin, Officer)
export const getAllRequests = async (req, res) => {
  try {
    // If officer, only show their assigned requests (optional logic)
    let query = {};
    if (req.user.role === 'officer') {
      query = { assignedTo: req.user._id };
    }

    const requests = await ServiceRequest.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email');
      
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status
// @route   PATCH /api/admin/requests/:id/status
// @access  Private (Admin, Officer)
export const updateRequestStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Basic validation
    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const previousStatus = request.status;
    
    // Update request
    request.status = status;
    if (status === 'Resolved') {
      request.resolvedAt = Date.now();
    }
    await request.save();

    // Log history
    await RequestHistory.create({
      requestId: request._id,
      changedBy: req.user._id,
      previousStatus,
      newStatus: status,
      note: note || `Status updated to ${status}`
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get basic analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res) => {
  try {
    const total = await ServiceRequest.countDocuments();
    const pending = await ServiceRequest.countDocuments({ status: 'Pending' });
    const inProgress = await ServiceRequest.countDocuments({ status: 'In Progress' });
    const resolved = await ServiceRequest.countDocuments({ status: 'Resolved' });
    
    // NEW: Count all users
    const totalUsers = await User.countDocuments();

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      open: pending + inProgress,
      totalUsers 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};