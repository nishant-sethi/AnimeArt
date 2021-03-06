var express= require('express');
var fs= require('fs');
var mongoose= require('mongoose');
var Schema = mongoose.Schema;
var ejs= require('ejs');
var multer= require('multer');
//app.use(express.static("public")); 
var app = express();
app.set('view engine','ejs');
var upload    = require('./upload');
// how to make mongo connection?
mongoose.connect('mongodb://localhost:27017/app', { useNewUrlParser: true,  useUnifiedTopology: true });
var photoSchema = new Schema({ 
	path: String,
	title: String,
	category: String,
	caption: String
 });
var Photo = mongoose.model('Photos',photoSchema);
app.use(multer({dest:'./uploads/'}).single('photo'));
//   function(filename, filename){
//  	return filename;
//  }
// }));
app.use(express.static("./"));//middleware for static files, not for ejs files
app.get('/',function(req,res){
	Photo.find({}, ['path','title','category','caption'], {sort:{ _id: -1} }, function(err, photos) {
     if(err) throw err;
     res.render('index', { root:__dirname,photolist : photos });   
});	
})

app.get('/upload',function(req,res){
	res.sendFile('dashboard.html', { root : __dirname});
})
app.post('/upload',function(req,res){
 // var newItem = new Item();
 // newItem.img.data = fs.readFileSync(req.files.userPhoto.path)
 // newItem.img.contentType = 'image/jpg';
 // newItem.save();

upload(req, res,(error) => {
      if(error){
         res.redirect('/?msg=3');
      }else{
        if(req.file == undefined){
          
          res.redirect('/?msg=2');
        }else{
             
            /**
             * Create new record in mongoDB
             */
            var fullPath = "files/"+req.file.filename;
            var document = {
              path:     fullPath, 
              caption:   req.body.caption,
              category: req.body.category,
              title: req.body.title,
            };
  
          var photo = new Photo(document); 
          photo.save(function(error){
            if(error){ 
              throw error;
            } 
            res.redirect('/?msg=1');
         });
      }
    }
  });

});

app.listen(3000, function(){
	console.log("server running");
});

