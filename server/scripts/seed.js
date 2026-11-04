require('dotenv').config();

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('../models/user');
const Profile = require('../models/profile');
const Category = require('../models/category');
const Course = require('../models/course');
const Section = require('../models/section');
const SubSection = require('../models/subSection');
const CourseProgress = require('../models/courseProgress');
const RatingAndReview = require('../models/ratingAndReview');

const FRONTEND_URL = (process.env.FRONTEND_URL || 'https://devs-olive.vercel.app').replace(/\/$/, '');
const thumbnailDirectory = path.resolve(__dirname, '../../frontend/public/thumbnails');
const prices = [0, 499, 999, 1499, 2999];
const sampleVideos = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
];
const lessonDurations = ['08:42', '12:15', '09:30', '14:05', '10:24', '07:50', '11:18', '13:36', '06:55'];

const categorySeeds = [
    { name: 'Web Development', description: 'Build accessible, responsive websites and full-stack applications with modern web technologies.' },
    { name: 'C++', description: 'Develop strong C++ programming skills, from language fundamentals to algorithms and systems concepts.' },
    { name: 'DevOps', description: 'Learn practical automation, CI/CD, containers, cloud infrastructure, and reliable deployment workflows.' },
    { name: 'Web Designing', description: 'Design thoughtful digital experiences with visual systems, responsive layouts, and user-centered principles.' },
    { name: 'Machine Learning', description: 'Explore data preparation, machine learning models, evaluation, and responsible AI applications.' },
    { name: 'Block Chain', description: 'Understand blockchain foundations, smart contracts, decentralized applications, and Web3 security.' },
    { name: 'Cyber Security', description: 'Build defensive security skills in networking, secure development, incident response, and risk assessment.' },
    { name: 'Cpp', description: 'Learn C++ programming, object-oriented design, and practical problem solving.' },
    { name: 'Python', description: 'Build useful skills in Python programming, automation, and data analysis.' },
    { name: 'Data Structures', description: 'Practice algorithms and data structures used to solve real programming problems.' },
    { name: 'Java', description: 'Learn Java fundamentals, object-oriented programming, and application development.' },
];

const curatedCourses = {
    'Web Development': [
        ['HTML and CSS Foundations', 'semantic HTML and responsive CSS', 'Create well-structured pages and responsive layouts using semantic HTML and modern CSS.', 'Build accessible page structure, style responsive layouts, and organize reusable design rules.', ['HTML', 'CSS', 'Accessibility']],
        ['JavaScript for Interactive Websites', 'JavaScript and browser interactions', 'Add useful interactions to web pages with JavaScript, events, and browser APIs.', 'Write functions, handle browser events, and update page content with the DOM.', ['JavaScript', 'DOM', 'Frontend']],
        ['React Applications from Scratch', 'React components and application state', 'Build a small React application using reusable components, props, state, and routing.', 'Compose components, manage local state, and organize a multi-page interface.', ['React', 'JavaScript', 'Frontend']],
        ['Building Web APIs with Node.js', 'Node.js APIs and HTTP fundamentals', 'Create a maintainable REST API with Node.js, Express, validation, and error handling.', 'Design HTTP routes, validate request data, and structure Express controllers.', ['Node.js', 'Express', 'API']],
    ],
    'C++': [
        ['Modern C++ Fundamentals', 'modern C++ syntax and standard library', 'Write clear C++ programs using modern language features and standard library tools.', 'Use types, functions, containers, and resource-safe programming patterns.', ['C++', 'Programming', 'Standard Library']],
        ['Object-Oriented C++ Design', 'classes and object-oriented design in C++', 'Model small applications with classes, interfaces, composition, and clear responsibilities.', 'Design classes, use inheritance carefully, and separate interfaces from implementation.', ['C++', 'OOP', 'Software Design']],
        ['C++ Data Structures and Algorithms', 'C++ data structures and algorithmic complexity', 'Implement common data structures and reason about algorithm performance in C++.', 'Use vectors, maps, queues, trees, and complexity analysis to solve problems.', ['C++', 'Algorithms', 'Data Structures']],
        ['C++ Systems Programming', 'memory, files, and system-level C++', 'Explore memory, file handling, and system programming through focused C++ exercises.', 'Manage resources safely, process files, and understand low-level program behavior.', ['C++', 'Systems', 'Memory']],
    ],
    'DevOps': [
        ['Linux and Shell for DevOps', 'Linux administration and shell scripting', 'Automate everyday operations with Linux commands, shell scripts, and reliable workflows.', 'Navigate Linux systems, compose shell commands, and automate repeatable tasks.', ['Linux', 'Shell', 'Automation']],
        ['Docker Containers in Practice', 'Docker images and container workflows', 'Package and run applications consistently with Docker images, containers, and volumes.', 'Create Dockerfiles, manage container lifecycles, and persist application data.', ['Docker', 'Containers', 'DevOps']],
        ['CI/CD with GitHub Actions', 'continuous integration and delivery pipelines', 'Build a practical CI/CD pipeline that checks, packages, and deploys an application.', 'Define workflow jobs, manage build artifacts, and automate release steps.', ['CI/CD', 'GitHub Actions', 'Automation']],
        ['Kubernetes Deployment Essentials', 'Kubernetes workloads and deployments', 'Deploy and inspect containerized applications using core Kubernetes resources.', 'Configure pods, deployments, services, and application health checks.', ['Kubernetes', 'Containers', 'Cloud']],
    ],
    'Web Designing': [
        ['Design Systems with Figma', 'Figma components and design systems', 'Create a consistent visual language with reusable components, tokens, and variants.', 'Build component libraries, define design tokens, and maintain interface consistency.', ['Figma', 'Design Systems', 'UI']],
        ['Responsive UI and Layout Design', 'responsive interface layout principles', 'Plan responsive page layouts that remain clear and usable across device sizes.', 'Use layout grids, spacing systems, and breakpoints to adapt interfaces.', ['Responsive Design', 'UI', 'Layouts']],
        ['UX Research and Wireframing', 'user research and low-fidelity prototyping', 'Turn user needs into clear journeys, wireframes, and testable interface ideas.', 'Plan research questions, map user flows, and sketch low-fidelity screens.', ['UX', 'Research', 'Wireframing']],
        ['Typography and Visual Hierarchy', 'typography and visual communication', 'Use type, contrast, and spacing to make digital interfaces easier to scan.', 'Choose readable type scales, establish hierarchy, and apply accessible contrast.', ['Typography', 'Visual Design', 'Accessibility']],
    ],
    'Machine Learning': [
        ['Machine Learning with Python', 'Python machine learning workflows', 'Train and evaluate introductory machine learning models with reproducible Python workflows.', 'Prepare data, train baseline models, and evaluate predictions with suitable metrics.', ['Python', 'Machine Learning', 'Scikit-learn']],
        ['Data Preparation for ML', 'feature preparation and data quality', 'Prepare reliable datasets through cleaning, transformation, and feature engineering.', 'Identify data quality issues, transform features, and prevent evaluation leakage.', ['Data Preparation', 'Python', 'Machine Learning']],
        ['Deep Learning Fundamentals', 'neural networks and deep learning', 'Understand neural network building blocks and train a small model end to end.', 'Explain layers and activations, train models, and interpret learning curves.', ['Deep Learning', 'Neural Networks', 'Python']],
        ['Model Evaluation and Responsible AI', 'model evaluation and responsible AI', 'Evaluate model quality, fairness, and limitations before using predictions in practice.', 'Select evaluation metrics, inspect error patterns, and document model limitations.', ['Responsible AI', 'Evaluation', 'Machine Learning']],
    ],
    'Block Chain': [
        ['Blockchain and Ethereum Foundations', 'blockchain transactions and Ethereum', 'Understand blocks, transactions, wallets, and the Ethereum execution model.', 'Explain transaction flow, use wallet concepts, and inspect basic blockchain data.', ['Blockchain', 'Ethereum', 'Web3']],
        ['Solidity Smart Contracts', 'Solidity contracts and testing', 'Write and test small Solidity contracts while learning safe contract structure.', 'Define contract state, write functions, and test expected contract behavior.', ['Solidity', 'Smart Contracts', 'Ethereum']],
        ['Building a Web3 Frontend', 'wallet-connected decentralized applications', 'Connect a web interface to a smart contract and handle wallet interactions.', 'Read contract data, submit transactions, and represent wallet states in a UI.', ['Web3', 'Frontend', 'DApps']],
        ['Smart Contract Security Basics', 'smart contract security fundamentals', 'Recognize common smart contract risks and practice safer development habits.', 'Review access control, validate inputs, and identify common contract vulnerabilities.', ['Security', 'Solidity', 'Smart Contracts']],
    ],
    'Cyber Security': [
        ['Network Security Foundations', 'network protocols and defensive monitoring', 'Learn core networking concepts and methods for identifying suspicious activity.', 'Read network flows, understand common protocols, and recognize alert signals.', ['Networking', 'Security', 'Monitoring']],
        ['Secure Coding and OWASP Risks', 'secure coding and common web risks', 'Reduce common web application risks through practical secure coding patterns.', 'Validate input, protect sessions, and understand common web security risks.', ['OWASP', 'Secure Coding', 'Web Security']],
        ['Incident Response Essentials', 'security incident response workflows', 'Practice a structured response workflow for triage, containment, and recovery.', 'Preserve evidence, prioritize incidents, and document response actions.', ['Incident Response', 'Security Operations', 'Risk']],
        ['Cloud Security Fundamentals', 'cloud identity and infrastructure security', 'Apply foundational security controls to cloud identities, data, and workloads.', 'Review identity permissions, protect stored data, and monitor cloud resources.', ['Cloud Security', 'IAM', 'Infrastructure']],
    ],
};

const legacyCategoryTopics = {
    Cpp: ['C++ syntax and functions', 'C++ classes and object design', 'C++ algorithms and containers', 'C++ project development'],
    Python: ['Python programming foundations', 'Python automation and scripting', 'Python data handling', 'Python application projects'],
    'Data Structures': ['arrays and linked lists', 'stacks and queues', 'trees and graphs', 'algorithm analysis'],
    Java: ['Java language foundations', 'Java object-oriented design', 'Java collections and APIs', 'Java application projects'],
};

const instructors = [
    { firstName: 'Aarav', lastName: 'Sharma', email: 'instructor@abhyas.demo', password: 'AbhyasInstructor!2026', about: 'Software engineer and educator focused on practical programming.' },
    { firstName: 'Meera', lastName: 'Iyer', email: 'meera.iyer@abhyas.demo', password: 'AbhyasMeera!2026', about: 'Product designer and instructor teaching accessible digital experiences.' },
    { firstName: 'Kabir', lastName: 'Rao', email: 'kabir.rao@abhyas.demo', password: 'AbhyasKabir!2026', about: 'Cloud and platform engineer sharing reliable delivery practices.' },
    { firstName: 'Anika', lastName: 'Patel', email: 'anika.patel@abhyas.demo', password: 'AbhyasAnika!2026', about: 'Security and data practitioner focused on responsible technology.' },
];
const accountSeeds = [
    { key: 'admin', firstName: 'Abhyas', lastName: 'Admin', email: 'admin@abhyas.demo', password: 'AbhyasAdmin!2026', accountType: 'Admin', about: 'Demo administrator account.' },
    ...instructors.map((instructor, index) => ({ ...instructor, key: `instructor-${index}`, accountType: 'Instructor' })),
    { key: 'demo-student', firstName: 'Anaya', lastName: 'Verma', email: 'student@abhyas.demo', password: 'AbhyasStudent!2026', accountType: 'Student', about: 'Demo learner account for exploring courses.' },
    ...[
        ['Riya', 'Kapoor'], ['Dev', 'Malhotra'], ['Sara', 'Nair'], ['Ishaan', 'Mehta'],
        ['Nisha', 'Reddy'], ['Arjun', 'Das'], ['Tara', 'Menon'], ['Vihaan', 'Joshi'],
    ].map(([firstName, lastName], index) => ({
        key: `reviewer-${index}`,
        firstName,
        lastName,
        email: `reviewer${String(index + 1).padStart(2, '0')}@abhyas.demo`,
        password: 'AbhyasReviewer!2026',
        accountType: 'Student',
        about: 'Demo learner account used for course feedback.',
    })),
];
const reviewComments = [
    'The examples made the main ideas easy to apply.',
    'Clear explanations and a useful pace throughout.',
    'I liked the practical exercises and the course structure.',
    'A helpful course with concepts I can use in my own projects.',
    'The walkthroughs made a challenging topic feel approachable.',
    'Good balance of explanation and hands-on practice.',
    'Well organized, with useful details in each lesson.',
    'A solid introduction and a clear path for continued practice.',
];

const normalize = (value) => value.toLowerCase().replace(/\+/g, 'p').replace(/[^a-z0-9]/g, '');
const xmlEscape = (value) => value.replace(/[<>&"']/g, (character) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
}[character]));

function createThumbnailSvg(categoryName, courseName) {
    const title = xmlEscape(courseName);
    const category = xmlEscape(categoryName);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#071427"/><stop offset="1" stop-color="#183454"/></linearGradient></defs><rect width="1280" height="720" fill="url(#bg)"/><path d="M0 575 1280 245v475H0Z" fill="#0B1C32" opacity=".8"/><rect x="96" y="94" width="12" height="530" rx="6" fill="#FFD60A"/><text x="150" y="170" fill="#FFD60A" font-family="Arial,sans-serif" font-size="30" font-weight="700">ABHYAS · ${category.toUpperCase()}</text><foreignObject x="150" y="220" width="1030" height="300"><div xmlns="http://www.w3.org/1999/xhtml" style="font:700 72px/1.12 Arial,sans-serif;color:#f1f2ff;max-height:300px;overflow:hidden">${title}</div></foreignObject><text x="150" y="600" fill="#c5c7d4" font-family="Arial,sans-serif" font-size="28">Practice today. Grow every day.</text></svg>`;
}

function writeThumbnail(categoryName, courseName) {
    fs.mkdirSync(thumbnailDirectory, { recursive: true });
    const slug = `${normalize(categoryName)}-${normalize(courseName)}`;
    fs.writeFileSync(path.join(thumbnailDirectory, `${slug}.svg`), createThumbnailSvg(categoryName, courseName));
    return `${FRONTEND_URL}/thumbnails/${slug}.svg`;
}

function buildCourseSeed(categoryName, definition, index) {
    const [courseName, topic, courseDescription, whatYouWillLearn, tag] = definition;
    return {
        courseName,
        categoryName,
        topic,
        courseDescription,
        whatYouWillLearn,
        tag,
        price: prices[index % prices.length],
    };
}

function generatedDefinition(categoryName, topic, index) {
    const title = `${categoryName} ${['Foundations', 'in Practice', 'Project Workshop', 'Skills Lab'][index % 4]}`;
    return [
        title,
        topic,
        `Build practical ${topic} skills through clear explanations, guided examples, and focused exercises.`,
        `Explain the core ideas in ${topic}, apply them in a small exercise, and review your work using practical checkpoints.`,
        [categoryName, topic.split(' ')[0], 'Practice'],
    ];
}

async function upsertAccount(account, index) {
    const existing = await User.findOne({ email: account.email });
    const profileData = {
        gender: 'Prefer not to say',
        dateOfBirth: '1995-01-01',
        about: account.about,
        contactNumber: 9000001000 + index,
    };
    let profile = existing?.additionalDetails ? await Profile.findById(existing.additionalDetails) : null;
    if (profile) {
        Object.assign(profile, profileData);
        await profile.save();
    } else {
        profile = await Profile.create(profileData);
    }

    return User.findOneAndUpdate(
        { email: account.email },
        {
            $set: {
                firstName: account.firstName,
                lastName: account.lastName,
                password: await bcrypt.hash(account.password, 10),
                accountType: account.accountType,
                active: true,
                approved: true,
                additionalDetails: profile._id,
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(`${account.firstName} ${account.lastName}`)}&background=FFD60A&color=000814`,
            },
            $setOnInsert: { courses: [], courseProgress: [] },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
}

async function upsertCategory(categorySeed) {
    return Category.findOneAndUpdate(
        { name: categorySeed.name },
        { $set: { description: categorySeed.description } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
}

async function upsertCourse(courseSeed, category, instructor, courseIndex) {
    const thumbnail = writeThumbnail(category.name, courseSeed.courseName);
    const course = await Course.findOneAndUpdate(
        { category: category._id, courseName: courseSeed.courseName },
        {
            $set: {
                courseDescription: courseSeed.courseDescription,
                instructor: instructor._id,
                whatYouWillLearn: courseSeed.whatYouWillLearn,
                price: courseSeed.price,
                category: category._id,
                tag: courseSeed.tag,
                instructions: [
                    'Complete the lessons in order and try each exercise before continuing.',
                    'Use the course examples as a starting point for your own small project.',
                    'Review the key ideas at the end of each section.',
                ],
                status: 'Published',
                thumbnail,
                updatedAt: new Date(),
            },
            $setOnInsert: { createdAt: new Date(), studentsEnrolled: [], courseContent: [], ratingAndReviews: [] },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await ensureCourseContent(course, courseSeed);
    await Category.updateOne({ _id: category._id }, { $addToSet: { courses: course._id } });
    await User.updateOne({ _id: instructor._id }, { $addToSet: { courses: course._id } });
    return { course, courseIndex };
}

async function ensureCourseContent(course, courseSeed) {
    if (course.courseContent?.length >= 3) return;

    const sectionIds = [];
    for (let sectionIndex = 0; sectionIndex < 3; sectionIndex += 1) {
        const sectionName = `${course.courseName} | ${['Core Concepts', 'Guided Practice', 'Applied Project'][sectionIndex]}`;
        const subsectionIds = [];
        for (let lessonIndex = 0; lessonIndex < 3; lessonIndex += 1) {
            const lessonTitle = `${course.courseName}: ${['Introduction', 'Key Techniques', 'Practice Exercise'][lessonIndex]} ${sectionIndex + 1}`;
            const subsection = await SubSection.findOneAndUpdate(
                { title: lessonTitle },
                {
                    $set: {
                        title: lessonTitle,
                        timeDuration: lessonDurations[(sectionIndex * 3 + lessonIndex) % lessonDurations.length],
                        description: `Practice ${courseSeed.topic} with a guided example and a short knowledge check.`,
                        videoUrl: sampleVideos[(sectionIndex + lessonIndex) % sampleVideos.length],
                    },
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            subsectionIds.push(subsection._id);
        }
        const section = await Section.findOneAndUpdate(
            { sectionName },
            { $set: { sectionName, subSection: subsectionIds } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        sectionIds.push(section._id);
    }
    course.courseContent = sectionIds;
    await course.save();
}

async function upsertReview(course, reviewer, courseIndex, reviewerIndex) {
    const rating = String(3 + ((courseIndex + reviewerIndex) % 3));
    const review = await RatingAndReview.findOneAndUpdate(
        { course: course._id, user: reviewer._id },
        { $set: { rating, review: reviewComments[(courseIndex + reviewerIndex) % reviewComments.length] } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    await Course.updateOne(
        { _id: course._id },
        { $addToSet: { ratingAndReviews: review._id, studentsEnrolled: reviewer._id } }
    );
    await User.updateOne({ _id: reviewer._id }, { $addToSet: { courses: course._id } });
}

async function ensureDemoEnrollment(student, course) {
    const completedVideos = course.courseContent?.[0]?.subSection
        ?.slice(0, 1)
        .map((subsection) => subsection._id || subsection) || [];
    const progress = await CourseProgress.findOneAndUpdate(
        { courseID: course._id, userId: student._id },
        { $set: { completedVideos } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    await Course.updateOne({ _id: course._id }, { $addToSet: { studentsEnrolled: student._id } });
    await User.updateOne(
        { _id: student._id },
        { $addToSet: { courses: course._id, courseProgress: progress._id } }
    );
}

async function seed() {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set.');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB.');

    const usersByEmail = new Map();
    for (const [index, account] of accountSeeds.entries()) {
        const user = await upsertAccount(account, index);
        usersByEmail.set(account.email, user);
        if (account.accountType !== 'Student') console.log(`${account.accountType} ready: ${account.email}.`);
    }

    const categories = await Promise.all(categorySeeds.map(upsertCategory));
    const categoriesByName = new Map(categories.map((category) => [category.name, category]));
    const allCategories = await Category.find({});
    const instructorsByEmail = instructors.map((item) => usersByEmail.get(item.email));
    let courseIndex = 0;

    for (const category of allCategories) {
        const categoryDefinitions = curatedCourses[category.name] || [];
        for (const definition of categoryDefinitions) {
            const seedCourse = buildCourseSeed(category.name, definition, courseIndex);
            await upsertCourse(seedCourse, category, instructorsByEmail[courseIndex % instructorsByEmail.length], courseIndex);
            courseIndex += 1;
        }

        let publishedCount = await Course.countDocuments({ category: category._id, status: 'Published' });
        let fillerIndex = 0;
        while (publishedCount < 4) {
            const topic = legacyCategoryTopics[category.name]?.[fillerIndex % 4] || `${category.name} skills and projects`;
            const definition = generatedDefinition(category.name, topic, fillerIndex);
            const seedCourse = buildCourseSeed(category.name, definition, courseIndex);
            await upsertCourse(seedCourse, category, instructorsByEmail[courseIndex % instructorsByEmail.length], courseIndex);
            courseIndex += 1;
            fillerIndex += 1;
            publishedCount = await Course.countDocuments({ category: category._id, status: 'Published' });
        }

        await Category.updateOne({ _id: category._id }, {
            $addToSet: { courses: { $each: await Course.find({ category: category._id, status: 'Published' }).distinct('_id') } },
        });
    }

    const publishedCourses = await Course.find({ status: 'Published' }).sort({ courseName: 1 });
    const reviewers = accountSeeds
        .filter((account) => account.key.startsWith('reviewer-'))
        .map((account) => usersByEmail.get(account.email));
    const courseIndexes = new Map();

    for (const course of publishedCourses) {
        const category = await Category.findById(course.category);
        const instructor = instructorsByEmail[courseIndex % instructorsByEmail.length];
        await User.updateOne({ _id: course.instructor }, { $addToSet: { courses: course._id } });
        await Category.updateOne({ _id: category._id }, { $addToSet: { courses: course._id } });
        if (course.courseContent?.length < 3) {
            const topic = `${category.name} practical skills`;
            await ensureCourseContent(course, { topic });
        }
        if (!course.thumbnail || course.thumbnail.includes('placehold.co')) {
            course.thumbnail = writeThumbnail(category.name, course.courseName);
            await course.save();
        }
        const index = courseIndexes.size;
        courseIndexes.set(course._id.toString(), index);
        for (let reviewerIndex = 0; reviewerIndex < reviewers.length; reviewerIndex += 1) {
            await upsertReview(course, reviewers[reviewerIndex], index, reviewerIndex);
        }
        void instructor;
    }

    const demoStudent = usersByEmail.get('student@abhyas.demo');
    const webCategory = categoriesByName.get('Web Development');
    const cppCategory = categoriesByName.get('C++');
    const demoCourses = await Course.find({
        category: { $in: [webCategory._id, cppCategory._id] },
        status: 'Published',
    }).populate({ path: 'courseContent', populate: { path: 'subSection' } }).sort({ courseName: 1 }).limit(2);

    await Course.updateMany({}, { $pull: { studentsEnrolled: demoStudent._id } });
    await User.updateOne({ _id: demoStudent._id }, { $set: { courses: [], courseProgress: [] } });
    await CourseProgress.deleteMany({ userId: demoStudent._id });
    for (const course of demoCourses) await ensureDemoEnrollment(demoStudent, course);

    const finalCategories = await Category.find({}).sort({ name: 1 });
    const categoryCounts = [];
    for (const category of finalCategories) {
        const count = await Course.countDocuments({ category: category._id, status: 'Published' });
        categoryCounts.push({ category: category.name, publishedCourses: count });
        if (count < 4) throw new Error(`Category ${category.name} has fewer than four published courses after seeding.`);
    }

    console.log(`Seed complete: ${finalCategories.length} categories, ${publishedCourses.length} published courses processed.`);
    console.table(categoryCounts);
}

seed()
    .catch((error) => {
        console.error(`Seed failed (${error.name || 'Error'}). Check DATABASE_URL and database availability; sensitive details were omitted.`);
        process.exitCode = 1;
    })
    .finally(async () => {
        if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    });
