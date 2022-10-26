const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const debug=require('debug')('app:cloudinary')
cloudinary.config({
    cloud_name: "dnchdypnw",
    api_key: "329819486516926",
    api_secret: "8RCWjN2rWWBjH_kF-RyvyGmSDEE",
});


async function uploadToCloudinary(locaFilePath,file) {
    
    // locaFilePath: path of image which was just
    // uploaded to "uploads" folder
  
    var mainFolderName = "main";
    // filePathOnCloudinary: path of image we want
    // to set when it is uploaded to cloudinary
    var filePathOnCloudinary = 
        mainFolderName + "/" + file.filename;
    
    debug("Uploading to cloudinary...")
    debug(locaFilePath)
    debug(filePathOnCloudinary)
    return cloudinary.uploader
        .upload(locaFilePath, { public_id: filePathOnCloudinary })
        .then((result) => {
            
            debug("Image Uploaded")
            // Image has been successfully uploaded on
            // cloudinary So we dont need local image 
            // file anymore
            // Remove file from local uploads folder
            fs.unlinkSync(locaFilePath);
  
            return {
                message: "Success",
                url: result.url,
            };
        })
        .catch((error) => {
            debug("Failed to upload")
            debug(error)
            // Remove file from local uploads folder
           fs.unlinkSync(locaFilePath);
            return { message: "Fail" };
        });
}

module.exports.uploadToCloudinary=uploadToCloudinary