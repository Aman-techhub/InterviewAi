const multer = require("multer")

const upload= multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, callback) => {
        if (file.mimetype !== "application/pdf") {
            return callback(new Error("Only PDF resumes are supported."))
        }

        callback(null, true)
    },
    limits:{
        fileSize:3*1024*1024
    }
})

module.exports=upload