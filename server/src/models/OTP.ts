import mongoose, { Document, Schema } from 'mongoose';
import mailSender from '../utils/mailSender';
import { BRAND_NAME } from '../config/brand';

interface IOTP extends Document {
    email: string;
    otp: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const OTPSchema = new Schema<IOTP>(
    {
        email: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            expires: 300 // The document will be automatically deleted after 5 minutes of its creation time
        }
    }
);

// Function to send email
async function sendVerificationEmail(email: string, otp: string): Promise<void> {
    try {
        await mailSender(email, `Verification Email from ${BRAND_NAME}`, otp);
        console.log('Email sent successfully to - ', email);
    } catch (error) {
        console.error('Error while sending an email to ', email);
        throw error;
    }
}

// Pre middleware to send email before saving
OTPSchema.pre('save', async function (next) {
    // Only send an email when a new document is created
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

export default mongoose.model<IOTP>('OTP', OTPSchema);
