const Category = require('../models/category')
const mongoose = require('mongoose');

// ================ create Category ================
exports.createCategory = async (req, res) => {
    try {
        // extract data
        const { name, description } = req.body;

        // validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const categoryDetails = await Category.create({
            name: name, description: description
        });

        res.status(200).json({
            success: true,
            message: 'Category created successfully'
        });
    }
    catch (error) {
        console.log('Error while creating Category');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while creating Category',
            error: error.message
        })
    }
}


// ================ get All Category ================
exports.showAllCategories = async (req, res) => {
    try {
        // get all category from DB with courses
        const allCategories = await Category.find(
            {},
            { name: true, description: true }
        ).populate({
            path: "courses",
            match: { status: "Published" },
        });

        // return response
        res.status(200).json({
            success: true,
            data: allCategories,
            message: 'All allCategories fetched successfully'
        })
    }
    catch (error) {
        console.log('Error while fetching all allCategories');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching all allCategories'
        })
    }
}



// ================ Get Category Page Details ================
exports.getCategoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: [
                    { path: "ratingAndReviews" },
                    { path: "instructor", select: "firstName lastName email image" },
                ],
            })
            .exec()

        if (!selectedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" })
        }

        const categoriesExceptSelected = await Category.find({ _id: { $ne: categoryId } })
            .populate({ path: "courses", match: { status: "Published" } })
            .exec();
        const categoriesWithCourses = categoriesExceptSelected.filter((category) => category.courses.length);
        const differentCategory = categoriesWithCourses.length
            ? categoriesWithCourses[Math.floor(Math.random() * categoriesWithCourses.length)]
            : null;

        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: [
                    { path: "instructor", select: "firstName lastName email image" },
                    { path: "ratingAndReviews" },
                ],
            })
            .exec()

        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 10)

        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}