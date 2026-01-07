
import prisma from '../../prisma.setup.js';

const streamModelData = async (key, modelDelegate, includeOptions, sendEvent) => {
    try {
        sendEvent('progress', { message: `Processing ${key}...` });
        const data = await modelDelegate.findMany({ include: includeOptions });
        sendEvent('data', { type: key, data });
        return data.length;
    } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        sendEvent('error', { message: `Failed to fetch ${key}: ${error.message}` });
        throw error; // Re-throw to handle in main flow
    }
};

export const exportAllDataSSE = async (req, res, next) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendEvent = (type, data) => {
        res.write(`event: ${type}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
        sendEvent('start', { message: 'Initiating database export...' });

        const counts = {};

        // Sequential execution guarantees "Staged" progress updates

        // Stage 1: Core User Data
        counts.doctors = await streamModelData('doctors', prisma.doctor,
            { Appointment: true, patients: true, medicineDiaries: true }, sendEvent);

        counts.patients = await streamModelData('patients', prisma.patient,
            { Appointment: true, images: true, medicineDiaries: true, doctor: true }, sendEvent);

        // Stage 2: Clinical Data
        counts.appointments = await streamModelData('appointments', prisma.appointment,
            { doctor: true, patient: true }, sendEvent);

        counts.medicineDiaries = await streamModelData('medicineDiaries', prisma.medicineDiary,
            { doctor: true, patient: true }, sendEvent);

        // Stage 3: Media & Analytics
        counts.images = await streamModelData('images', prisma.image,
            { patient: true }, sendEvent);

        counts.youtubeVideos = await streamModelData('youtubeVideos', prisma.youtubeVideo,
            undefined, sendEvent);

        counts.visitorCounters = await streamModelData('visitorCounters', prisma.visitorCounter,
            undefined, sendEvent);

        sendEvent('progress', { message: 'Finalizing export package...' });

        const metadata = {
            message: "Full database export (SSE Stream)",
            exportedAt: new Date().toISOString(),
            recordCounts: counts
        };
        sendEvent('data', { type: 'metadata', data: metadata });

        sendEvent('end', { message: 'Export completed successfully!' });
        res.end();

    } catch (error) {
        console.error("SSE Export Error:", error);
        // Connection might be closed by client, or other network error
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        } else {
            // Try to send error event if stream is still open
            try { sendEvent('error', { message: 'Internal Server Error during stream' }); } catch (e) { }
            res.end();
        }
    }
}
