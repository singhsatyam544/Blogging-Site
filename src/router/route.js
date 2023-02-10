const express=require('express')
const router= express.Router()
const authorController=require('../controller/authorController')
const blogController = require('../controller/blogController')
const auth = require("../middleware/auth")



router.post('/authors',authorController.createAuthor)
router.post('/blogs', auth.authenticate, blogController.createBlog)
router.get('/getBlogs',auth.authenticate, blogController.getBlogs)
router.put('/blogs/:blogId', auth.authenticate,auth.authorise, blogController.updateBlogs)
router.delete('/deleteBlogs/:blogId',auth.authenticate,auth.authorise, blogController.deleteById)
router.delete('/deleteByQuery',auth.authenticate ,auth.delByQeury, blogController.deleteByQuery)
router.post('/loginAuthor', authorController.loginAuthor)
router.get('/getBlogsByAuthentication',auth.authenticate, blogController.getBlogs)

module.exports=router
