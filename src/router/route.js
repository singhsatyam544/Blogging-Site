const express=require('express')
const router= express.Router()
const authorController=require('../controller/authorController')
const blogController = require('../controller/blogController')


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post('/authors',authorController.createAuthor)
router.post('/blogs', blogController.createBlog)
router.get('/getBlogs', blogController.getBlogs)
router.put('/blogs/:blogId', blogController.updateBlogs)
router.delete('/deleteBlogs/:blogId', blogController.deleteBlogs)
router.delete('/deleteByParams',blogController.deleteByParams)

module.exports=router
