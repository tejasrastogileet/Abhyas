const Rajorpay = require('razorpay');
const instance = require('../config/rajorpay');
const crypto = require('crypto');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');
const { BRAND_NAME } = require('../config/brand');
require('dotenv').config();

const User = require('../models/user');
const Course = require('../models/course');
const CourseProgress = require("../models/courseProgress")


const { default: mongoose } = require('mongoose')


// ================ capture the payment and Initiate the 'Rajorpay order' ================
exports.capturePayment = async (req, res) => {

    // extract courseId & userId
    const { coursesId } = req.body;
    // console.log('coursesId = ', typeof (coursesId))
    // console.log('coursesId = ', coursesId)

    const userId = req.user.id;


    if (!Array.isArray(coursesId) || coursesId.length === 0) {
        return res.json({ success: false, message: "Please provide Course Id" });
    }

    let totalAmount = 0;

    for (const course_id of coursesId) {
        let course;
        try {
            // valid course Details
            course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({ success: false, message: "Could not find the course" });
            }

            // check user already enrolled the course
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(400).json({ success: false, message: "Student is already Enrolled" });
            }

            totalAmount += course.price;
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    if (totalAmount === 0) {
        try {
            await enrollStudents(coursesId, userId);
            return res.status(200).json({ success: true, message: { free: true } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // create order for paid courses
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    // initiate payment using Rajorpay
    try {
        const paymentResponse = await instance.instance.orders.create(options);
        // return response
        res.status(200).json({
            success: true,
            message: paymentResponse,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, mesage: "Could not Initiate Order" });
    }

}



// ================ verify the payment ================
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.coursesId;
    const userId = req.user.id;
    // console.log(' req.body === ', req.body)

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        return res.status(400).json({ success: false, message: "Payment Failed, data not found" });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        try {
            await enrollStudents(courses, userId);
            return res.status(200).json({ success: true, message: "Payment Verified" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    return res.status(200).json({ success: "false", message: "Payment Failed" });

}


// ================ enroll Students to course after payment ================
const enrollStudents = async (courses, userId) => {
    if (!Array.isArray(courses) || !userId) throw new Error("Please provide courses and user ID.");
    for (const courseId of courses) {
        const enrolledCourse = await Course.findOne({ _id: courseId, status: 'Published' });
        if (!enrolledCourse) throw new Error("Published course not found.");

        const wasEnrolled = enrolledCourse.studentsEnrolled.some((id) => id.toString() === userId.toString());
        await Course.updateOne({ _id: courseId }, { $addToSet: { studentsEnrolled: userId } });

        let progress = await CourseProgress.findOne({ courseID: courseId, userId });
        if (!progress) {
            progress = await CourseProgress.create({ courseID: courseId, userId, completedVideos: [] });
        }
        const enrolledStudent = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { courses: courseId, courseProgress: progress._id } },
            { new: true }
        );

        if (!wasEnrolled && enrolledStudent) {
            mailSender(
                enrolledStudent.email,
                `${BRAND_NAME}: Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, enrolledStudent.firstName)
            ).catch((error) => console.error('Enrollment email failed:', error.message));
        }
    }
}



exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;

    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    try {
        // find student
        const enrolledStudent = await User.findById(userId);
        const email = mailSender(
            enrolledStudent.email,
            `${BRAND_NAME}: Payment Received`,
            `<p>Hi ${enrolledStudent.firstName},</p><p>Your payment of ${amount / 100} was received.</p><p>Order: ${orderId}<br>Payment: ${paymentId}</p>`
        );
        email.catch((error) => console.error('Payment email failed:', error.message));
        return res.status(200).json({ success: true, message: 'Payment email queued.' });
    }
    catch (error) {
        console.error("Could not prepare payment email:", error.message);
        return res.status(200).json({ success: true, message: 'Payment completed.' });
    }
}


// ================ verify Signature ================
// exports.verifySignature = async (req, res) => {
//     const webhookSecret = '12345678';

//     const signature = req.headers['x-rajorpay-signature'];

//     const shasum = crypto.createHmac('sha256', webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest('hex');


//     if (signature === digest) {
//         console.log('Payment is Authorized');

//         const { courseId, userId } = req.body.payload.payment.entity.notes;

//         try {
//             const enrolledCourse = await Course.findByIdAndUpdate({ _id: courseId },
//                 { $push: { studentsEnrolled: userId } },
//                 { new: true });

//             // wrong upper ?

//             if (!enrolledCourse) {
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Course not found'
//                 });
//             }

//             // add course id to user course list
//             const enrolledStudent = await User.findByIdAndUpdate(userId,
//                 { $push: { courses: courseId } },
//                 { new: true });

//             // send enrolled mail

//             // return response
//             res.status(200).json({
//                 success: true,
//                 message: 'Signature Verified and Course Added'
//             })
//         }

//         catch (error) {
//             console.log('Error while verifing rajorpay signature');
//             console.log(error);
//             return res.status(500).json({
//                 success: false,
//                 error: error.messsage,
//                 message: 'Error while verifing rajorpay signature'
//             });
//         }
//     }

//     else {
//         return res.status(400).json({
//             success: false,
//             message: 'Invalid signature'
//         });
//     }
// }