const Notification = require("../models/notification.model");

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, { read: true });

    res.json({ message: "Marked as read" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports={
    getMyNotifications,markAsRead
    
}