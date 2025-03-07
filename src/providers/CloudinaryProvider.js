import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: 'auto',
};

const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(file, opts, (error, result) => {
            if (result && result.secure_url) {
                return resolve(result);
            }
            return reject({ message: error.message });
        });
    });
};

const deleteFile = (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.destroy(publicId).then(resolve).catch(reject);
    });
};

const extractPublicId = (url) => {
    try {
        // Chỉ lấy phần sau "/upload/" và trước phần mở rộng "."
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
        return match ? match[1] : null;
    } catch (error) {
        console.error('Error extracting public_id:', error.message);
        return null;
    }
};

export default { uploadFile, deleteFile, extractPublicId };
