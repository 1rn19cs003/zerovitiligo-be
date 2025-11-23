import { addNewYoutubeUrl, getAllYoutubeUrls } from "../model/youtube.model.js";

export const getAllUrl = async (req, res, next) => {
    try {
        const response = await getAllYoutubeUrls();
        return res.status(200).json({ success: true, data: response });
    } catch (error) {
        next(error);
    }
};
export const addNewUrl = async (req, res, next) => {
    try {
        const { url, title, author } = req.body;
        const payload = {
            url,
            title,
            author
        }
        const response = await addNewYoutubeUrl(payload);
        return res.status(200).json({ success: true, data: response });
    } catch (error) {
        next(error);
    }
};
