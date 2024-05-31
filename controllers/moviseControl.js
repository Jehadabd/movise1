const Movies = require('../models/movies')
exports.create = async (req, res) => {
    const { name, category, description } = req.body
    const movies = Movies({ name, category, description })
    await movies.save()
    res.json({
        success: true,
        data: movies
    })
}
exports.find = async (req, res) => {
    const { id } = req.params
    // get all the movies and their content except the reveiws
    const movies = await Movies.findById(id).select('-reviews')
    console.log(movies)
    if (!movies) {
        res.status(401).json({
            message: "not found "
        })
    }
    else {
        res.status(200).json({
            find: {
                data: movies
            }
        })
    }
}
exports.update = async (req, res) => {
    const { id } = req.params;
    const movies = {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description
    }
    await Movies.updateOne({ _id: id }, { $set: movies }).then(result => {
        res.status(202).json({
            message: "Moviese updated successfully"
        });
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            message: err.message
        });
    });
}
exports.delete = async (req, res) => {
    const { id } = req.params;
    const movies = await Movies.findByIdAndDelete(id)
    if (!movies) {
        res.status(401).json({
            message: "not found "
        })
    }
    else {
        res.status(200).json({
            find: {
                data: movies
            }
        })
    }
}
exports.list = async (req, res) => {
    const page = req.query?.page || 1
    const limit = 5
    const skip = (page - 1) * limit
    // get all the movies and their content except the reveiws
    const movies = await Movies.find().select('-reviews').skip(skip).limit(limit)
    const total = await Movies.countDocuments()
    const pages = Math.ceil(total / limit)
    res.status(200).json({
        success: true,
        pages,
        data: movies,
    })
}
exports.reviews = async (req, res) => {
    console.log(1)
    const { id } = req.params
    // هذا الصطر يقوم باضهار المراجعات وطبع اسماء المستخدمين الذين قامو بالمراجعه
    const movie = await Movies.findById(id).select('-reviews._id').populate('reviews.user','name')
    console.log(2)
    if (!movie) {
        console.log(3)
        return res.status(404).send()
    }
    res.json({
        success: true,
        data: movie.reviews
    })
}
exports.addReviews = async (req, res) => {
    const { id } = req.params;
    const { comment, rate } = req.body
    const movies = await Movies.findById(id)

    if (!movies) {
        res.status(401).json({
            message: "not found "
        })
    }
    const isRated = movies.reviews.findIndex(m => m.user == req.userId)
    if (isRated > -1) { return res.status(403).json({ message: "Reviwes is already added" }) }
    const totalRate = movies.reviews.reduce((sum, review) => sum + review.rate, 0)
    const findRate = (totalRate + rate) / (movies.reviews.length + 1)
    await Movies.updateOne({ _id: id }, {
        $push: {
            reviews: {
                user: req.userId, comment, rate
            }
        }, $set: { rate: findRate }
    }
    )
    res.status(201).json({
        success: true
    })
}