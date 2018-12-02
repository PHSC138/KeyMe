var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var validator=require('validator');
var AWS=require('aws-sdk');
var cors=require('cors');

//Configure AWS
const config=require('./config');
AWS.config.update(config.aws_config);

//Configure body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Set port
var port=process.env.PORT||3001;
app.use(cors());
var router=express.Router();

//Default route: http://localhost:3001/api
router.get("/",function(req,res){
    res.json({
        message:"KeyMe-API",
        functions:{
            get:{
                "/":"Welcome message and help",
                "/getdb":"Returns json database",
            },
            post:{
                "/hash":"Inserts new hash to database with the form: {\"data\":\"salt:algorithm:iterations:hash:hash_time}\"",
                "/crack":"Checks hash in databse with the form: {\"data\":\"hash:username\"} will update user cracks and hash cracks",
                "/user":"Returns user cracks in database with the form: {\"data\":\"username\"}",
            },
        },
    });
});

router.get("/getdb",function(req,res){
    var dynamodb=new AWS.DynamoDB();
    var params={
        TableName:config.aws_table_name,
    };
    dynamodb.scan(params,function(err,data){
        if(err){
            res.json({message:err});
            console.log(err,err.stack); // an error occurred
        }
        else{
            res.json({message:data});
            console.log(data);           // successful response
        }
    });
});

//Add hashed password to database (accessed at POST http://localhost:3001/api/hash)
router.route('/hash').post(function(req,res){
    //Get hash from body of request with form:
    //salt:sha256:1:4edf07edc95b2fdcbcaf2378fd12d8ac212c2aa6e326c59c3e629be3039d6432:22
    var data=req.body.data;
    console.log(req.body);
    if(data===undefined){
        res.json({message:"data undefined"});
        return;
    }
    var split=data.split(":");
    var salt=split[0];
    if(salt===undefined){
        res.json({message:"salt undefined"});
        return;
    }
    if(!(validator.isAscii(salt))){
        res.json({message:"ascii characters in salt only please"});
        return;
    }

    var algorithm=split[1];
    if(algorithm===undefined){
        res.json({message:"algorithm undefined"});
        return;
    }
    if(!(validator.isAlphanumeric(algorithm))){
        res.json({message:"algorithm can not contain special characters"});
        return;
    }

    var iterations=split[2];
    if(iterations===undefined){
        res.json({message:"iterations undefined"});
        return;
    }
    if(!(validator.isInt(iterations))){
        res.json({message:"iterations NaN"});
        return;
    }

    var hash=split[3];
    if(hash===undefined){
        res.json({message:"hash undefined"});
        return;
    }
    if(!(validator.isHash(hash,algorithm))){
        res.json({message:"hash is not "+algorithm});
        return;
    }

    var hash_time=split[4];
    if(hash_time===undefined){
        res.json({message:"hash_time undefined"});
        return;
    }
    if(!(validator.isInt(hash_time))){
        res.json({message:"hash_time NaN"});
        return;
    }

    var date=new Date();
    var dd=date.getDate();
    var mm=date.getMonth()+1;

    if(dd<10)dd='0'+dd
    if(mm<10)mm='0'+mm
    date=mm+'/'+dd+'/'+date.getFullYear();

    var dynamodb=new AWS.DynamoDB();
    dynamodb.putItem({
        "TableName":config.aws_table_name,
        "Item":{
            "hash":{"S":hash},
            "algorithm":{"S":algorithm},
            "date":{"S":date},
            "hash_time":{"N":hash_time},
            "iterations":{"N":iterations},
            "salt":{"S":salt},
            "cracks":{"N":"0"}
        }
    },function(result){
        if(result==null){
            res.json({message:"success"});
            result="success";
        }
        else res.json({message:result});
        console.log(""+result);
    });
});

router.route('/crack').post(function(req,res){
    //Get hash from body of request with form:
    //hash:username
    var data=req.body.data;
    console.log(req.body);
    if(data===undefined){
        res.json({message:"data undefined"});
        return;
    }
    var split=data.split(":");
    var hash=split[0];
    if(hash==undefined){
        res.json({message:"hash undefined"});
        return;
    }
    var username=split[1];
    if(username==undefined){
        res.json({message:"username undefined"});
        return;
    }

    var dynamodb=new AWS.DynamoDB();

    console.log("Getting item for hash.");
    var params={
        TableName:config.aws_table_name,
        Key:{"hash":{S:hash}},
        AttributesToGet:['cracks'],
    }
    dynamodb.getItem(params,function(err,data){
        if(err){
            res.json({message:err});
            console.log(err, err.stack); // an error occurred
            return;
        }
        console.log("getItem data;");
        console.log(data);
        if(Object.keys(data).length===0&&data.constructor===Object){
            res.json({message:"hash not found"});
            return;
        }

        var params={
            TableName:config.aws_table_name2,
            Key:{"username":{S:username}},
            AttributesToGet:['cracks'],
        }

        console.log("Checking user");
        dynamodb.getItem(params, function(err, data) {
            if (err){
                console.log("GET USER ERROR");
                console.log(err, err.stack); // an error occurred
                res.json({message:err});
                return;
            }
            console.log("GET USER DATA");
            console.log(data);
            if(Object.keys(data).length===0&&data.constructor===Object){
                //CREATE NEW USER WITH 1 CRACK
                var params={
                    TableName:config.aws_table_name2,
                    Item:{
                        username:{S:username},
                        cracks:{N:"1"}
                    }
                };
                dynamodb.putItem(params,function(err,data){
                    if (err) console.log("CREATE USER ERROR",err, err.stack); // an error occurred
                    else console.log("CREATE USER SUCCESS",data);           // successful response
                });
            }else{
                let uCracks=parseInt(data.Item.cracks.N);
                uCracks+=1;
                uCracks=uCracks.toString();
                //User exists, update User cracks
                var params={
                    TableName:config.aws_table_name2,
                    Key:{"username":{S:username}},
                    ExpressionAttributeNames:{"#C":"cracks"},
                    ExpressionAttributeValues:{":n":{N:uCracks}},
                    ReturnValues:"ALL_NEW",
                    UpdateExpression:"SET #C=:n"
                }

                dynamodb.updateItem(params,function(err,data){
                    if(err) console.log("UPDATE USER ERROR",err, err.stack); // an error occurred
                    else console.log("UPDATE USER SUCCESS",data);           // successful response
                });
            }
        });

        let cracks=parseInt(data.Item.cracks.N);
        cracks+=1;
        cracks=cracks.toString();

        console.log("Updating item");
        var params={
            TableName:config.aws_table_name,
            Key:{"hash":{S:hash}},
            ExpressionAttributeNames:{"#C":"cracks"},
            ExpressionAttributeValues:{":n":{N:cracks}},
            ReturnValues:"ALL_NEW",
            UpdateExpression:"SET #C=:n"
        }

        dynamodb.updateItem(params,function(err, data){
            if(err){
                res.json({message:err});
                console.log(err, err.stack); // an error occurred
                return;
            }
            else{
                console.log(data);           // successful response
                res.json({message:"success"});
                return;
            }
        });
    });
});

router.get("/user",function(req,res){
    //Get username from body of request with form:
    //username
    //var id = req.query.id; // $_GET["id"]
    var username=req.query.user;
    console.log(req.body);
    if(username===undefined){
        res.json({message:"username undefined"});
        return;
    };

    var dynamodb=new AWS.DynamoDB();
    var params={
        TableName:config.aws_table_name2,
        Key:{"username":{S:username}},
        AttributesToGet:['cracks'],
    };

    console.log("Getting user cracks");
    dynamodb.getItem(params, function(err, data) {
        if (err){
            console.log(err, err.stack);
            res.json({message:err});
            return;
        }
        console.log(data);
        if(Object.keys(data).length===0&&data.constructor===Object)res.json({cracks:"0"}); //Return 0
        else res.json({cracks:data.Item.cracks.N}); //User exists, return cracks
    });
});

app.use("/api",router);

app.listen(port);
console.log("KeyMe-API started on port "+port+".");
