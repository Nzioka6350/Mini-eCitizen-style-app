import ServiceRequest from "../models/ServiceRequest.js";
import RequestHistory from "../models/RequestHistory.js";
import Service from "../models/Service.js";

// @desc    Create a new service request
// @route   POST /api/requests
// @access  Private (Citizen)
export const createRequest = async (req, res) => {
  try {
    const { serviceId, title, category, subCounty, landmark, description } =
      req.body;

    // Verify the service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Create the request
    const newRequest = await ServiceRequest.create({
      userId: req.user._id,
      serviceId,
      title,
      category,
      location: { subCounty, landmark },
      description,
      status: "Pending",
    });

    // Create the initial history entry
    await RequestHistory.create({
      requestId: newRequest._id,
      changedBy: req.user._id,
      previousStatus: null,
      newStatus: "Pending",
      note: "Request submitted by citizen",
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's requests
// @route   GET /api/requests/my-requests
// @access  Private (Citizen)
export const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("serviceId", "title category"); // Populate service info if needed

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get request by ID (and its history)
// @route   GET /api/requests/:id
// @access  Private
export const getRequestById = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("assignedTo", "name email");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Authorization: Only the creator, an assigned officer, or an admin can view
    if (
      request.userId._id.toString() !== req.user._id.toString() &&
      req.user.role === "citizen"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this request" });
    }

    // Fetch history
    const history = await RequestHistory.find({ requestId: request._id })
      .sort({ createdAt: 1 })
      .populate("changedBy", "name role");

    res.json({ request, history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
