const express=require('express')
const bodyParser=require('body-parser')
const route=require('./router/route')
const mongoose=require('mongoose')
const app=express()

app.use(bodyParser.json())

mongoose.connect("mongodb+srv://singhsatyam544:test@cluster0.s2bskcq.mongodb.net/project-1",{
    useNewUrlParser:true
})
.then(()=>console.log('Mongo is connected'))
.catch(err=> console.log(err))

app.use('/', route)

app.listen(process.env.PORT||3000, ()=>console.log("Express app running on port "+(process.env.PORT||3000)))