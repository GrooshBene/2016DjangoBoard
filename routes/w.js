/**
 * Created by GrooshBene on 2016. 11. 21..
 */
module.exports = init;
function init(app, Article, randomString, path) {
    app.post('/w/:title', function(req, res){
        Article.findOne({title : req.param('title')}).exec(function (err, result) {
            if(err){
                console.log('/w/:title DB Error');
                throw err;
            }
                console.log("Article "+ result.title + ' Has Found');
                res.send(200, result);
        })
    })

    app.get('/w/:title', function (req, res) {
        Article.findOne({title : req.param('title')}).exec(function (err, result) {
            if(err){
                console.log('/w/:title GET Param DB Error');
                throw err;
            }
            if(!result){
                res.sendFile(path.resolve('views/post_none.html'));
            }
            else if(result){
                res.sendFile(path.resolve('views/post.html'));
            }
        })
    })

    app.get('/w/none', function (req, res) {
        res.sendFile(path.resolve('views/post_none.html'));
    })

    app.post('/w/:title/edit', function (req, res) {
        Article.findOneAndUpdate({title : req.param('title')}, {rare_content : req.param('content')}, function (err, result) {
            if(err){
                console.log('/w/:title/edit error');
                throw err;
            }
            console.log("Article : "+ req.param('title') + " Has Been Changed");
            res.send(200);
        });
    });

    app.get('/w/:title/edit', function (req, res) {
        console.log(req.user);
        // if(req.user == null){
        //     res.redirect("http://localhost:7070/auth/facebook");
        // }
        // else if(req.user != null){
            res.sendFile(path.resolve('views/edit.html'));
        // }
    })

    app.post('/w/write', function (req, res) {
        var article = new Article({
            _id : randomString.generate(14),
            title : req.param('title'),
            rare_content : req.param('content')
        });

        article.save(function (err, silence) {
            if(err){
                console.log("/w/new saving DB Error");
                throw err;
            }
            res.send(200, article);
        });
    });

    app.post('/w/new', function (req, res) {
        if(req.user == null){
            res.redirect("http://localhost:7070/auth/facebook");
        }
        else if(req.user != null){
            res.send("Developing!");
        }
    })

    app.post('/w/random', function(req, res){
        Article.find({}, function(err, result){
            if(err){
                console.log('/w/random DB Error');
                throw err;
            }
            var random = Math.floor( (Math.random() * (result.length - 0 + 1)) + 0 );
            res.send(200, result[random]);
        });
    });

    app.post('/w/recent', function (req, res) {
        Article.find({}, function (err, result) {
            if(err){
                console.log("/w/recent DB Error");
                throw err;
            }
            res.send(200, result[0]);
        });
    });

    app.get('/w/recent', function (req, res) {
        res.sendFile(path.resolve('views/recent.html'));
    });

    //function end
}