/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI2,
  file: (req, file) => {


    return {
      bucketName: 'photos',
      filename: `${Date.now()}-any-name-${file.originalname}`,
    }
  },
})

module.exports = multer({ storage: storage,
  limits: { fileSize: 1000000000 } })