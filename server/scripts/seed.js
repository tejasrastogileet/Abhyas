require('dotenv').config();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('../models/user');
const Profile = require('../models/profile');
const Category = require('../models/category');
const Course = require('../models/course');
const Section = require('../models/section');
const SubSection = require('../models/subSection');
const RatingAndReview = require('../models/ratingAndReview');

const categories = [
    { name: 'Cpp', description: 'Learn C++ programming, object-oriented design, and practical problem solving.' },
    { name: 'Python', description: 'Build useful skills in Python programming, automation, and data analysis.' },
    { name: 'Web Development', description: 'Create responsive websites and interactive applications for the modern web.' },
    { name: 'Data Structures', description: 'Practice algorithms and data structures used to solve real programming problems.' },
    { name: 'Java', description: 'Learn Java fundamentals, object-oriented programming, and application development.' },
];

const accounts = [
    {
        key: 'admin',
        firstName: 'Abhyas',
        lastName: 'Admin',
        email: 'admin@abhyas.demo',
        password: 'AbhyasAdmin!2026',
        accountType: 'Admin',
        about: 'Demo administrator account for the Abhyas learning platform.',
        contactNumber: 9000000001,
    },
    {
        key: 'instructor',
        firstName: 'Aarav',
        lastName: 'Sharma',
        email: 'instructor@abhyas.demo',
        password: 'AbhyasInstructor!2026',
        accountType: 'Instructor',
        about: 'Demo instructor focused on practical programming lessons.',
        contactNumber: 9000000002,
    },
    {
        key: 'student',
        firstName: 'Anaya',
        lastName: 'Verma',
        email: 'student@abhyas.demo',
        password: 'AbhyasStudent!2026',
        accountType: 'Student',
        about: 'Demo student account for exploring courses and reviews.',
        contactNumber: 9000000003,
    },
];

const courseSeeds = [
    {
        courseName: 'C++ Programming Fundamentals', categoryName: 'Cpp', topic: 'C++ fundamentals', price: 0,
        courseDescription: 'Start writing clear C++ programs and understand the language features behind reliable applications.',
        whatYouWillLearn: 'Write and compile C++ programs, use variables and functions, and apply basic object-oriented concepts.',
        tag: ['C++', 'Programming', 'Fundamentals'],
    },
    {
        courseName: 'Python Foundations', categoryName: 'Python', topic: 'Python foundations', price: 1499,
        courseDescription: 'Build a strong Python foundation through small programs, readable code, and guided exercises.',
        whatYouWillLearn: 'Use Python data types, control flow, functions, and modules to build useful scripts.',
        tag: ['Python', 'Programming', 'Beginner'],
    },
    {
        courseName: 'Responsive Web Development', categoryName: 'Web Development', topic: 'responsive web development', price: 1999,
        courseDescription: 'Learn the structure and styling behind accessible, responsive web pages.',
        whatYouWillLearn: 'Build semantic HTML pages, style layouts with CSS, and make interfaces adapt to different screens.',
        tag: ['HTML', 'CSS', 'Web Development'],
    },
    {
        courseName: 'Data Structures in Practice', categoryName: 'Data Structures', topic: 'data structures', price: 1799,
        courseDescription: 'Explore core data structures and learn how to choose them for common programming tasks.',
        whatYouWillLearn: 'Work with arrays, linked lists, stacks, queues, and compare their time and space tradeoffs.',
        tag: ['Algorithms', 'Data Structures', 'Problem Solving'],
    },
    {
        courseName: 'Java Object-Oriented Programming', categoryName: 'Java', topic: 'Java object-oriented programming', price: 0,
        courseDescription: 'Learn Java syntax and object-oriented techniques by building small, maintainable programs.',
        whatYouWillLearn: 'Create Java classes, use inheritance and interfaces, and organize code into packages.',
        tag: ['Java', 'OOP', 'Programming'],
    },
    {
        courseName: 'Python for Data Analysis', categoryName: 'Python', topic: 'Python data analysis', price: 2499,
        courseDescription: 'Use Python to clean, inspect, and summarize datasets with practical analysis workflows.',
        whatYouWillLearn: 'Load datasets, transform tabular data, and communicate findings with clear summaries.',
        tag: ['Python', 'Data Analysis', 'Practice'],
    },
    {
        courseName: 'Modern C++ Problem Solving', categoryName: 'Cpp', topic: 'modern C++ problem solving', price: 2299,
        courseDescription: 'Practice breaking programming challenges into smaller steps and implementing them in modern C++.',
        whatYouWillLearn: 'Use standard library containers, reason about complexity, and solve common coding challenges.',
        tag: ['C++', 'Algorithms', 'Problem Solving'],
    },
    {
        courseName: 'JavaScript for the Web', categoryName: 'Web Development', topic: 'JavaScript for web development', price: 1299,
        courseDescription: 'Add behavior to web pages with JavaScript fundamentals and browser APIs.',
        whatYouWillLearn: 'Use JavaScript functions, arrays, events, and DOM APIs to build interactive page features.',
        tag: ['JavaScript', 'Web Development', 'Frontend'],
    },
    {
        courseName: 'Trees and Graphs', categoryName: 'Data Structures', topic: 'trees and graphs', price: 2699,
        courseDescription: 'Understand tree and graph structures through traversals, search strategies, and guided exercises.',
        whatYouWillLearn: 'Represent trees and graphs, implement traversals, and select suitable search strategies.',
        tag: ['Algorithms', 'Trees', 'Graphs'],
    },
    {
        courseName: 'Java Collections and APIs', categoryName: 'Java', topic: 'Java collections and APIs', price: 2199,
        courseDescription: 'Use Java collections and standard APIs to write cleaner, more capable applications.',
        whatYouWillLearn: 'Choose collection types, process data with common APIs, and handle errors with exceptions.',
        tag: ['Java', 'Collections', 'APIs'],
    },
];

const reviewSeeds = [
    { courseName: 'C++ Programming Fundamentals', rating: '5', review: 'Clear explanations and useful exercises for getting started.' },
    { courseName: 'Python Foundations', rating: '4', review: 'A practical introduction with examples I could follow along with.' },
    { courseName: 'Responsive Web Development', rating: '5', review: 'The layout exercises made responsive design much easier to understand.' },
    { courseName: 'Data Structures in Practice', rating: '5', review: 'Good step-by-step coverage of the core structures.' },
    { courseName: 'Java Object-Oriented Programming', rating: '4', review: 'A helpful overview of classes, interfaces, and packages.' },
];

const sampleVideos = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
];

const slugFromCategoryName = (name) => name.split(' ').join('-').toLowerCase();

async function upsertAccount(account) {
    const existing = await User.findOne({ email: account.email });
    const profileData = {
        gender: 'Prefer not to say',
        dateOfBirth: '1995-01-01',
        about: account.about,
        contactNumber: account.contactNumber,
    };

    let profile = existing?.additionalDetails
        ? await Profile.findById(existing.additionalDetails)
        : null;

    if (profile) {
        Object.assign(profile, profileData);
        await profile.save();
    } else {
        profile = await Profile.create(profileData);
    }

    const passwordHash = await bcrypt.hash(account.password, 10);
    const user = await User.findOneAndUpdate(
        { email: account.email },
        {
            $set: {
                firstName: account.firstName,
                lastName: account.lastName,
                password: passwordHash,
                accountType: account.accountType,
                active: true,
                approved: true,
                additionalDetails: profile._id,
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(`${account.firstName} ${account.lastName}`)}&background=FFD60A&color=000814`,
                courses: existing?.courses || [],
            },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return user;
}

function courseSections(course) {
    return [
        {
            name: `${course.courseName} - Foundations`,
            lessons: [`Getting started with ${course.topic}`, `Core concepts in ${course.topic}`],
        },
        {
            name: `${course.courseName} - Guided Practice`,
            lessons: [`A guided ${course.topic} exercise`, `Review and next steps for ${course.topic}`],
        },
    ];
}

async function upsertCourse(courseSeed, category, instructor) {
    const course = await Course.findOneAndUpdate(
        { courseName: courseSeed.courseName },
        {
            $set: {
                courseDescription: courseSeed.courseDescription,
                instructor: instructor._id,
                whatYouWillLearn: courseSeed.whatYouWillLearn,
                price: courseSeed.price,
                category: category._id,
                tag: courseSeed.tag,
                instructions: [
                    'Complete lessons in order and pause to try each exercise.',
                    'Use the course discussion area to ask questions and share your approach.',
                ],
                status: 'Published',
                thumbnail: `https://placehold.co/1280x720/0B1220/FFD60A.jpg?text=${encodeURIComponent(courseSeed.courseName)}`,
                updatedAt: new Date(),
            },
            $setOnInsert: { createdAt: new Date() },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const sectionIds = [];
    for (const [sectionIndex, sectionSeed] of courseSections(courseSeed).entries()) {
        const subsectionIds = [];
        for (const [lessonIndex, lesson] of sectionSeed.lessons.entries()) {
            const subsection = await SubSection.findOneAndUpdate(
                { title: `${courseSeed.courseName}: ${lesson}` },
                {
                    $set: {
                        title: `${courseSeed.courseName}: ${lesson}`,
                        timeDuration: String(600 + lessonIndex * 180 + sectionIndex * 120),
                        description: `Practice ${courseSeed.topic} with this guided lesson.`,
                        videoUrl: sampleVideos[(sectionIndex + lessonIndex) % sampleVideos.length],
                    },
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            subsectionIds.push(subsection._id);
        }

        const section = await Section.findOneAndUpdate(
            { sectionName: sectionSeed.name },
            { $set: { sectionName: sectionSeed.name, subSection: subsectionIds } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        sectionIds.push(section._id);
    }

    course.courseContent = sectionIds;
    await course.save();
    await Category.updateOne({ _id: category._id }, { $addToSet: { courses: course._id } });
    await User.updateOne({ _id: instructor._id }, { $addToSet: { courses: course._id } });

    return course;
}

async function upsertReview(reviewSeed, course, student) {
    const review = await RatingAndReview.findOneAndUpdate(
        { course: course._id, user: student._id },
        { $set: { rating: reviewSeed.rating, review: reviewSeed.review } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await Course.updateOne(
        { _id: course._id },
        { $addToSet: { ratingAndReviews: review._id, studentsEnrolled: student._id } }
    );
    await User.updateOne({ _id: student._id }, { $addToSet: { courses: course._id } });
}

async function seed() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set.');
    }

    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB.');

    const categoryByName = new Map();
    for (const categorySeed of categories) {
        const category = await Category.findOneAndUpdate(
            { name: categorySeed.name },
            { $set: { description: categorySeed.description } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        categoryByName.set(category.name, category);
        console.log(`Category ready: ${category.name} (${slugFromCategoryName(category.name)}).`);
    }

    const usersByKey = new Map();
    for (const account of accounts) {
        const user = await upsertAccount(account);
        usersByKey.set(account.key, user);
        console.log(`Account ready: ${account.email} (${account.accountType}).`);
    }

    const coursesByName = new Map();
    for (const courseSeed of courseSeeds) {
        const category = categoryByName.get(courseSeed.categoryName);
        const course = await upsertCourse(courseSeed, category, usersByKey.get('instructor'));
        coursesByName.set(course.courseName, course);
        console.log(`Published course ready: ${course.courseName}.`);
    }

    for (const reviewSeed of reviewSeeds) {
        await upsertReview(
            reviewSeed,
            coursesByName.get(reviewSeed.courseName),
            usersByKey.get('student')
        );
    }

    console.log(`Seed complete: ${categories.length} categories, ${accounts.length} users, ${courseSeeds.length} courses, ${reviewSeeds.length} reviews.`);
}

seed()
    .catch((error) => {
        console.error(`Seed failed (${error.name || 'Error'}). Check DATABASE_URL and database availability; sensitive details were omitted.`);
        process.exitCode = 1;
    })
    .finally(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });