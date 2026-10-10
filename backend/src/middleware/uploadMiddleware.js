const multer = require('multer')
const path = require('path')

// Storage config — tells multer WHERE and HOW to save files
const storage = multer.diskStorage({
  // Save to the uploads folder
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  // Create a unique filename so files never overwrite each other
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, uniqueName + path.extname(file.originalname))
  },
})

// Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)   // Accept the file
  } else {
    cb(new Error('Only image files are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
})

module.exports = upload