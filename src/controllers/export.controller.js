
import prisma from '../../prisma.setup.js';

export const exportAllData = async (req, res, next) => {
    try {
        const [
            patients,
            doctors,
            appointments,
            medicineDiaries,
            images,
            youtubeVideos,
            visitorCounters
        ] = await Promise.all([
            prisma.patient.findMany({
                include: {
                    Appointment: true,
                    images: true,
                    medicineDiaries: true,
                    doctor: true
                }
            }),
            prisma.doctor.findMany({
                include: {
                    Appointment: true,
                    patients: true,
                    medicineDiaries: true
                }
            }),
            prisma.appointment.findMany({
                include: {
                    doctor: true,
                    patient: true
                }
            }),
            prisma.medicineDiary.findMany({
                include: {
                    doctor: true,
                    patient: true
                }
            }),
            prisma.image.findMany({
                include: {
                    patient: true
                }
            }),
            prisma.youtubeVideo.findMany(),
            prisma.visitorCounter.findMany()
        ]);

        const exportData = {
            patients,
            doctors,
            appointments,
            medicineDiaries,
            images,
            youtubeVideos,
            visitorCounters,
            metadata: {
                message: "Full database export including relations",
                exportedAt: new Date().toISOString(),
                recordCounts: {
                    patients: patients.length,
                    doctors: doctors.length,
                    appointments: appointments.length,
                    medicineDiaries: medicineDiaries.length,
                    images: images.length,
                    youtubeVideos: youtubeVideos.length
                }
            }
        };

        res.status(200).json(exportData);
    } catch (error) {
        next(error);
    }
}

export const exportAllDataSSE = async (req, res, next) => {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendEvent = (type, data) => {
        res.write(`event: ${type}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
        sendEvent('start', { message: 'Starting export process...' });

        // Fetch and send one by one to demonstrate streaming/progress

        // 1. Patients
        sendEvent('progress', { message: 'Fetching patients...' });
        const patients = await prisma.patient.findMany({
            include: { Appointment: true, images: true, medicineDiaries: true, doctor: true }
        });
        sendEvent('data', { type: 'patients', data: patients });

        // 2. Doctors
        sendEvent('progress', { message: 'Fetching doctors...' });
        const doctors = await prisma.doctor.findMany({
            include: { Appointment: true, patients: true, medicineDiaries: true }
        });
        sendEvent('data', { type: 'doctors', data: doctors });

        // 3. Appointments
        sendEvent('progress', { message: 'Fetching appointments...' });
        const appointments = await prisma.appointment.findMany({
            include: { doctor: true, patient: true }
        });
        sendEvent('data', { type: 'appointments', data: appointments });

        // 4. Medicine Diaries
        sendEvent('progress', { message: 'Fetching medicine diaries...' });
        const medicineDiaries = await prisma.medicineDiary.findMany({
            include: { doctor: true, patient: true }
        });
        sendEvent('data', { type: 'medicineDiaries', data: medicineDiaries });

        // 5. Images
        sendEvent('progress', { message: 'Fetching images...' });
        const images = await prisma.image.findMany({
            include: { patient: true }
        });
        sendEvent('data', { type: 'images', data: images });

        // 6. Youtube
        sendEvent('progress', { message: 'Fetching videos...' });
        const youtubeVideos = await prisma.youtubeVideo.findMany();
        sendEvent('data', { type: 'youtubeVideos', data: youtubeVideos });

        // 7. Visitor Counter
        sendEvent('progress', { message: 'Fetching visitor stats...' });
        const visitorCounters = await prisma.visitorCounter.findMany();
        sendEvent('data', { type: 'visitorCounters', data: visitorCounters });

        // Metadata
        const metadata = {
            message: "Full database export including relations (Streamed)",
            exportedAt: new Date().toISOString(),
            recordCounts: {
                patients: patients.length,
                doctors: doctors.length,
                appointments: appointments.length,
                medicineDiaries: medicineDiaries.length,
                images: images.length,
                youtubeVideos: youtubeVideos.length
            }
        };
        sendEvent('data', { type: 'metadata', data: metadata });

        sendEvent('end', { message: 'Export completed' });
        res.end();
    } catch (error) {
        console.error("SSE Export Error:", error);
        sendEvent('error', { message: error.message });
        res.end();
    }
}
