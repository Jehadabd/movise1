const express= require('express')
let router= express.Router()
const moviesCon=require('../controllers/moviseControl')
const auth=require('../middilwares/auth')
const admin=require('../middilwares/admin')
router.post('/',[auth.check,admin.check],moviesCon.create)
router.put('/:id',[auth.check,admin.check],moviesCon.update)
router.delete('/:id',[auth.check,admin.check],moviesCon.delete)
router.get('/',auth.check,moviesCon.list)
router.get('/:id',auth.check,moviesCon.find)
router.post('/:id/reviews',auth.check,moviesCon.addReviews)

router.get('/:id/reviews',moviesCon.reviews)
module.exports=router