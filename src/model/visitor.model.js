import prisma from '../../prisma.setup.js'

export const visitorCount = async () => {
    try {
        return (await prisma.visitorCounter.findFirst());
    } catch (err) {
        throw err;
    }
};

export const incrVisitorCount = async () => {
    try {
        let counter = await prisma.visitorCounter.findFirst();

        if (!counter) {
            counter = await prisma.visitorCounter.create({
                data: { count: 1 }
            });
        } else {
            counter = await prisma.visitorCounter.update({
                where: { id: counter.id },
                data: { count: { increment: 1 } }
            });
        }
        return counter.count;
    } catch (err) {
        throw err;
    }
};
