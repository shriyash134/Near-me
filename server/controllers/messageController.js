const Message = require("../message");

// Get all messages of a task
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      taskId: req.params.taskId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};