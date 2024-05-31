const express =require('express')
const router=express.Router()
const auth=require('../middilwares/auth')
const wlc=require('../controllers/watchListControl')
router.post('/',auth.check,wlc.add)
router.delete('/:movie',auth.check,wlc.delete)
router.get('/',auth.check,wlc.list)
module.exports=router