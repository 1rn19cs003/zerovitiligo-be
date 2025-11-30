import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Delete image from Cloudinary
export const deleteImage = async (req, res) => {
    try {
        const { publicId } = req.params;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: 'Public ID is required',
            });
        }

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== 'ok' && result.result !== 'not found') {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete image',
                result,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
            result,
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

// List images from Cloudinary (optional)
export const listImages = async (req, res) => {
    try {
        const { folder = '', maxResults = 30 } = req.query;

        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: folder,
            max_results: parseInt(maxResults),
        });

        return res.status(200).json({
            success: true,
            images: result.resources,
            total: result.resources.length,
        });
    } catch (error) {
        console.error('Error listing images:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

// Get upload signature for secure uploads (optional)
export const getUploadSignature = async (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const { folder = '' } = req.body;

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder,
            },
            process.env.CLOUDINARY_API_SECRET
        );

        return res.status(200).json({
            success: true,
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
        });
    } catch (error) {
        console.error('Error generating signature:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
