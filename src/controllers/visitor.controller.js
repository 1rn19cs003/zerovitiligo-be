import { incrVisitorCount, visitorCount } from '../model/visitor.model.js';


export const getVisitorCount = async (req, res, next) => {
    try {
        const counter = await visitorCount();
        return res.status(200).json({
            success: true,
            count: counter.count || 0
        });
    } catch (error) {
        next(error);
    }
};

export const incrementVisitorCount = async (req, res, next) => {
    try {
        const counter = await incrVisitorCount();

        return res.status(200).json({
            success: true,
            count: counter
        });
    } catch (error) {
        next(error);
    }
};
