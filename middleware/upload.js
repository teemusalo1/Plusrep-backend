/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI2,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {

    const match = ['image/png', 'image/jpeg' , 'image/jpg']

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-any-name-${file.originalname}`
      return filename
    }

    return {
      bucketName: 'photos',
      filename: `${Date.now()}-any-name-${file.originalname}`,
    }
  },
})

module.exports = multer({ storage })