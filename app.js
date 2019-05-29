const mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      express = require('express'),
      app = express();


// Mongoose Config
mongoose.connect('mongodb://localhost:27017/rest_lol_memes', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
const postSchema = new mongoose.Schema({
    title: String,
    image: String,
    dialog: String,
    video: String,
    created: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// app uses/sets
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

// Routes

// index
app.get("/", (req, res) => {
    res.redirect("/posts");
});

app.get("/posts", (req, res) => {
    Post.find({}, (err, posts) => {
        if(err) res.redirect("/")
        else res.render("index", {posts: posts});
    });
});

// new
app.get("/posts/new", (req, res) => {
    res.render("new");
});

// create
app.post("/posts", (req, res) => {
    Post.create(req.body.post, (err, post) => {
        if (err) res.redirect("/")
        else res.redirect("/");
    });
});

// show
app.get("/posts/:id", (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) console.log(err)
        else res.render("show", { post: post });
    });
});

// edit
app.get("/posts/:id/edit", (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) console.log(err)
        else res.render("edit", { post: post });
    });
});

//update
app.put("/posts/:id", (req, res) => {
    Post.findByIdAndUpdate(req.params.id, req.body.post, { new: true }, (err, post) => {
        if (err) console.log(err)
        else res.render("show", { post: post });
    });
});

//destroy 
app.delete("/posts/:id", (req, res) => {
    Post.findByIdAndRemove(req.params.id, req.body.post, (err) => {
        if (err) console.log(err)
        else res.redirect("/");
    });
});

app.listen(3000, () => {
    console.log(`Server is running on localhost:3000`);
});