const CookProfile = require('../models/CookProfile');

// @route   GET /api/admin/cooks/pending
// @desc    Get all cooks waiting for approval
exports.getPendingCooks = async (req, res) => {
  try {
    const cooks = await CookProfile.find({ isApproved: false }).populate('user', 'name email');
    res.status(200).json(cooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   PUT /api/admin/cooks/:id/approve
// @desc    Approve a cook and set FSSAI to Verified
exports.approveCook = async (req, res) => {
  try {
    const cook = await CookProfile.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, fssaiStatus: 'Verified' },
      { new: true }
    );
    res.status(200).json({ message: 'Cook approved successfully!', cook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};