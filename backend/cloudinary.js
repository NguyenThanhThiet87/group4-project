const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const sharp = require('sharp');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer memory storage (để sharp xử lý buffer)
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
});

// Middleware xử lý sharp + upload lên Cloudinary
const uploadWithSharp = (req, res, next) => {
    upload.single('avatar')(req, res, async (err) => {
        if (err) return res.status(400).json({ message: err.message });
        if (!req.file) return next();

        try {
            const buffer = await sharp(req.file.buffer)
                .resize({ width: 500, height: 500, fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 85 })
                .toBuffer();

            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'avatars', resource_type: 'image' },
                    (error, res) => (error ? reject(error) : resolve(res))
                );
                stream.end(buffer);
            });

            req.file.path = result.secure_url;
            req.file.filename = result.public_id.split('/').pop();
            next();
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Lỗi xử lý ảnh' });
        }
    });
};

module.exports = { cloudinary, uploadWithSharp };