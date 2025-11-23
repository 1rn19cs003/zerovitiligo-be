import prisma from '../../prisma.setup.js'


export const getAllYoutubeUrls = async () => {
    try {
        return await prisma.youtubeVideo.findMany();
    } catch (err) {
        console.log({ eoor: err })
        throw err;
    }
};
export const addNewYoutubeUrl = async (payload) => {
    try {
        return await prisma.youtubeVideo.create({
            data: payload,
        });
    } catch (err) {
        console.log({ eoor: err })
        throw err;
    }
};