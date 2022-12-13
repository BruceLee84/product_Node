const multer = require('multer');

const store = multer.diskStorage({
    destination:(req, file, callback)=>{
        callback(null, './upload/')
    },

    filename:(req, file, callback)=>{
        console.log(file.originalname)
        callback(null, `${file.originalname}`)

    }
}) 

module.exports ={store:store};

