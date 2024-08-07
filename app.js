require("dotenv").config()
const express=require("express")
const path=require('path')
const bodyParser=require("body-parser")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const Blog = require("./models/blog")


const PORT = process.env.PORT
const userRoute = require("./routes/user")
const blogRoute = require("./routes/blog")
const { checkForAuthenticationCookie } = require("./middlewares/auth")


const app=express()

mongoose.connect(process.env.MONGO_URL).then(console.log("MongoDB connected"))


app.set("view engine","ejs")
app.set('views',path.resolve("./views"))

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")))



app.use("/user",userRoute)
app.use("/blog",blogRoute)





app.get("/", async(req, res) => {
    const allBlogs = await Blog.find({})
    res.render("home",{
        user: req.user,
        blogs:allBlogs
    })
});


app.listen(PORT,console.log(`server connected at port ${PORT}`))