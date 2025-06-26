const Package = require('../models/Package');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

//    Get all packages (public)
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().populate('destination');
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


//    Get single package by ID (public)
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id).populate('destination');
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: 'Invalid package ID' });
  }
};


//    Create new package (admin)
exports.createPackage = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Upload buffer (in memory) to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'devkunwar_packages' },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Cloudinary upload failed', details: error.message });
        }
        // Create new package with image URL from Cloudinary
        const newPackage = new Package({
          ...req.body,
          image: result.secure_url, // Save Cloudinary image URL in DB
          cloudinary_id: result.public_id, // Save public_id for future deletion if needed
        });

        await newPackage.save();
        res.status(201).json({message:"New Package Created Successfully !",newPackage});
      }
    );

    // Pipe the buffer to Cloudinary uploader
    require('streamifier').createReadStream(req.file.buffer).pipe(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};



//    Update package by ID (admin)
exports.updatePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const existingPackage = await Package.findById(packageId);

    if (!existingPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    let imageUrl = existingPackage.image;
    let cloudinaryId = existingPackage.cloudinary_id;

    // Check if a new image file is uploaded
    if (req.file) {
      // Delete the old image from Cloudinary
      if (cloudinaryId) {
        await cloudinary.uploader.destroy(cloudinaryId);
      }

      // Upload the new image
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'devkunwar_packages' },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: 'Cloudinary upload failed', details: error.message });
          }

          imageUrl = result.secure_url;
          cloudinaryId = result.public_id;

          // Now update the package with new data
          const updatedPackage = await Package.findByIdAndUpdate(
            packageId,
            {
              ...req.body,
              image: imageUrl,
              cloudinary_id: cloudinaryId
            },
            { new: true }
          );

          res.status(200).json({message:"Your Package Updated Successfully !",updatedPackage});
        }
      );

      // Pipe image buffer to Cloudinary
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      // No image update; just update other fields
      const updatedPackage = await Package.findByIdAndUpdate(
        packageId,
        req.body,
        { new: true }
      );
      res.status(200).json({message:"Your Package Updated Successfully !",updatedPackage});
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

//    Delete package by ID (admin)
exports.deletePackage = async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Package not found' });
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting package', error: err.message });
  }
};
