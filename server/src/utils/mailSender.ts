import { BRAND_NAME } from '../config/brand';

const BREVO_EMAIL_API_URL = 'https://api.brevo.com/v3/smtp/email';
const REQUEST_TIMEOUT_MS = 10000;

const mailSender = async (
    email: string,
    title: string,
    body: string
): Promise<unknown> => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.MAIL_FROM_EMAIL;

    if (!apiKey || !senderEmail) {
        throw new Error('Email service is not configured. Set BREVO_API_KEY and MAIL_FROM_EMAIL.');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(BREVO_EMAIL_API_URL, {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: BRAND_NAME, email: senderEmail },
                to: [{ email }],
                subject: title,
                htmlContent: body
            }),
            signal: controller.signal
        });

        const responseBody = await response.text();
        let responseData: unknown = responseBody;
        try {
            responseData = responseBody ? JSON.parse(responseBody) : null;
        } catch {
            // Preserve a non-JSON response body for error reporting.
        }

        if (!response.ok) {
            console.error('Brevo email API request failed', {
                status: response.status,
                responseBody
            });
            const providerMessage = typeof responseData === 'object' && responseData !== null &&
                'message' in responseData && typeof responseData.message === 'string'
                ? responseData.message
                : responseBody;
            throw new Error(`Email delivery failed (HTTP ${response.status})${providerMessage ? `: ${providerMessage}` : ''}`);
        }

        return responseData;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.error('Brevo email API request timed out after 10 seconds');
            throw new Error('Email delivery timed out. Please try again.');
        }

        if (!(error instanceof Error) || !error.message.startsWith('Email delivery failed')) {
            console.error(
                'Brevo email API request failed before receiving a response:',
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
};

export default mailSender;
