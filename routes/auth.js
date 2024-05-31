const express= require('express')
let router= express.Router()
const authcon=require('../controllers/authcon')
const auth=require('../middilwares/auth')
router.post('/login',authcon.login)
router.post('/register',authcon.register)
router.get('/me',auth.check,authcon.me)
router.put('/update/:id',authcon.update)
module.exports=router