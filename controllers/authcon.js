const User = require('../models/user');
const jwtHelpers = require('../utils/jwtHelpers')
const bcrypt = require('bcrypt')
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (user && bcrypt.compareSync(password, user.password)) {
        console.log(user.name)
        res.json({
            success: 'true',
            data: {
                name: user.name,
                accessToken: jwtHelpers.sign({ sub: user.id })
            }
        })
    }
    else {
        res.status(401).json({
            message: "not found "
        })
    }
};
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const user = User({
        name, email, password: bcrypt.hashSync(password, 8)
    })
    try {
        await user.save()
        res.json({
            success: true
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'wrong!'
        })
    };
};
exports.me = async (req, res) => {
    const user = await User.findById(req.userId)
    res.json({
        success: true,
        data: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    })
}
exports.update = async (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = {
            name: req.body.name,
            userName: req.body.userName,
            password: hash,
            isAdmin: req.body.isAdmin
        };
        User.updateOne({ _id: req.params.id }, { $set: user }).then(result => {
            res.status(202).json({
                message: "User updated successfully"
            });
        }).catch(err => {
            console.log(err)
            res.status(500).json({
                message: err.message
            });
        });
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            message: err.message
        });
    });
};
