
exports.uploadFile = async (req, res, next) => {
    try {
      const files = await req.files;
  
      if (!files) {
        return res.status(404).json({
          success: false,
          data: "No file",
        });
      }
      req.url = files[0].location;
      next();
    } catch (err) {
      return res.status(404).json({
        success: false,
        data: "Not Found",
      });
    }
  };