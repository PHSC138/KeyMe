/*From this tutorial: https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4 */

var express=require('express');
var app=express();
var bodyParser=require('body-parser');

//Configure body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Set port
var port=process.env.PORT||3001;

var router=express.Router();

//Default route: http://localhost:3001/api
router.get("/",function(req,res){
    res.json({message:"KeyMe-API"});
});

//Add hashed password to database (accessed at POST http://localhost:3001/api/hash)
router.route('/hash').post(function(req,res){
    //Get hash from body of request
    var hash=req.body.hash;

});


app.use("/api",router);

app.listen(port);
console.log("KeyMe-API started on port "+port+".");
