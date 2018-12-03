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
    res.set("Access-Control-Allow-Origin","*");
    res.json({
        message:"KeyMe-API",
        functions:{
            get:{
                "/":{
                    "params":"none",
                    "return":"this message",
                    "description":"Welcome message and help",
                },
                "/getdb":{
                    "params":"none",
                    "return":"{\"cracks\":{\"N\":\"0\"},\"hash\":{\"S\":\"4edf08edc95b2fdcbcaf2378fd12d8ac212c2aa6e326c59c3e629be3039d6432\"},\"date\":{\"S\":\"11/27/2018\"},\"hash_time\":{\"N\":\"22\"},\"salt\":{\"S\":\"exampleSalt\"},\"algorithm\":{\"S\":\"sha256\"},\"iterations\":{\"N\":\"1\"}}",
                    "description":"Gets hashes in database"
                },
                "/getusers":{
                    "params":"none",
                    "return":"{\"username\":{\"S\":\"username\"},\"cracks\":{\"N\":\"4\"}}",
                    "description":"Gets users in database"
                },
                "/user":{
                    "params":"?user=username",
                    "return":"{\"cracks\":\"4\"}",
                    "description":"Gets user cracks",
                },
            },
            post:{
                "/hash":{
                    "body":"{\"data\":\"salt:algorithm:iterations:hash:hash_time:username\"}",
                    "return":"{\"message\":\"success\"} or error message",
                    "description":"Inserts hash into to database",
                },
                "/crack":{
                    "body":"{\"data\":\"hash:username\"}",
                    "return":"{\"message\":\"success\"} or error message",
                    "description":"Checks hash in databse and updates user cracks and hash cracks",
                },
            },
        },
    });
});

router.get("/getdb",function(req,res){
    res.set("Access-Control-Allow-Origin","*");
    var dynamodb=new AWS.DynamoDB();
    var params={TableName:config.aws_table_name};
    dynamodb.scan(params,function(err,data){
        if(err){
            res.json({message:""+err});
            console.log(err,err.stack); // an error occurred
        }else{
            res.json({message:data});
            console.log(data);           // successful response
        }
    });
});

router.get("/getusers",function(req,res){
    res.set("Access-Control-Allow-Origin","*");
    var dynamodb=new AWS.DynamoDB();
    var params={TableName:config.aws_table_name2};
    dynamodb.scan(params,function(err,data){
        if(err){
            res.json({message:""+err});
            console.log(err,err.stack); // an error occurred
        }else{
            res.json({message:data});
            console.log(data);           // successful response
        }
    });
});

router.get("/user",function(req,res){
    res.set("Access-Control-Allow-Origin","*");
    var username=req.query.user;
    console.log(req.body);
    if(username===undefined){
        res.json({message:"username undefined"});
        return;
    };

    console.log("Getting user cracks");
    var dynamodb=new AWS.DynamoDB();
    var params={
        TableName:config.aws_table_name2,
        Key:{"username":{S:username}},
        AttributesToGet:['cracks'],
    };

    dynamodb.getItem(params, function(err, data) {
        if (err){
            console.log(err, err.stack);
            res.json({message:""+err});
            return;
        }
        console.log(data);
        if(Object.keys(data).length===0&&data.constructor===Object)res.json({cracks:"0"}); //Return 0
        else res.json({cracks:data.Item.cracks.N}); //User exists, return cracks
    });
});

router.route('/hash').post(function(req,res){
    res.set("Access-Control-Allow-Origin","*");
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
    if(salt!==""&&!(validator.isAscii(salt))){
        res.json({message:"salt can only contain ascii characters"});
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

    var user=split[5];
    if(user===undefined){
        res.json({message:"user undefined"});
        return;
    }
    if(!(validator.isAscii(user))){
        res.json({message:"user can only contain ascii characters"});
        return;
    }

    //Check if hash already exists
    console.log("Getting item for hash.");
    var dynamodb=new AWS.DynamoDB();
    var params={
        TableName:config.aws_table_name,
        Key:{"hash":{S:hash}},
        AttributesToGet:['cracks'],
    }
    dynamodb.getItem(params,function(err,data){
        if(err) console.log(err, err.stack); // an error occurred

        console.log("getItem data;");
        console.log(data);

        //Hash exists
        if(Object.keys(data).length!==0){
            res.json({message:"hash already exists"});
            return;
        }
        var date=new Date();
        var dd=date.getDate();
        var mm=date.getMonth()+1;

        if(dd<10)dd='0'+dd
        if(mm<10)mm='0'+mm
        date=mm+'/'+dd+'/'+date.getFullYear();

        var dynamodb=new AWS.DynamoDB();
        var params;
        if(salt!==""){
            params={
                "TableName":config.aws_table_name,
                "Item":{
                    "hash":{"S":hash},
                    "algorithm":{"S":algorithm},
                    "date":{"S":date},
                    "hash_time":{"N":hash_time},
                    "iterations":{"N":iterations},
                    "salt":{"S":salt},
                    "cracks":{"N":"0"},
                    "users":{"L":[{"S":user}]}
                }
            }
        }else{
            params={
                "TableName":config.aws_table_name,
                "Item":{
                    "hash":{"S":hash},
                    "algorithm":{"S":algorithm},
                    "date":{"S":date},
                    "hash_time":{"N":hash_time},
                    "iterations":{"N":iterations},
                    "cracks":{"N":"0"},
                    "users":{"L":[{"S":user}]}
                }
            }
        }

        dynamodb.putItem(params,function(result){
            if(result==null){
                res.json({message:"success"});
                result="success";
            }else res.json({message:""+result});
        console.log(""+result);
        });
    });
});

router.route("/crack").post(function(req,res){
    res.set("Access-Control-Allow-Origin","*");
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


    console.log("Getting item for hash.");
    var dynamodb=new AWS.DynamoDB();
    var params={
        TableName:config.aws_table_name,
        Key:{"hash":{S:hash}},
        AttributesToGet:['cracks','users'],
    }
    dynamodb.getItem(params,function(err,data){
        if(err){
            res.json({message:""+err});
            console.log(err, err.stack); // an error occurred
            return;
        }
        console.log("getItem data;");
        console.log(data);
        if(Object.keys(data).length===0&&data.constructor===Object){
            res.json({message:"hash not found"});
            return;
        }

        //Check if user has already cracked hash
        for(user in data.Item.users.L){
            if(data.Item.users.L[user].S==username){
                res.json({message:"you've already cracked this hash"});
                return;
            }
        }

        console.log("Updating user cracks");
        var params={
            TableName:config.aws_table_name2,
            Key:{"username":{S:username}},
            ExpressionAttributeNames:{"#C":"cracks"},
            ExpressionAttributeValues:{":num":{"N":"1"}},
            ReturnValues:"ALL_NEW",
            UpdateExpression:"SET #C=#C+:num"
        }
        dynamodb.updateItem(params,function(err, data){
            if(err){
                //User not found, create user with 1 crack
                var params={
                    TableName:config.aws_table_name2,
                    Item:{
                        username:{S:username},
                        cracks:{N:"1"}
                    }
                };
                dynamodb.putItem(params,function(err,data){
                    if (err)console.log("CREATE USER ERROR",err, err.stack);
                    else console.log("CREATE USER SUCCESS",data);
                });
            }
            console.log(data);
            return;
        });

        //Continue updating the hash table with cracks and users
        console.log("Updating db");
        let cracks=parseInt(data.Item.cracks.N);
        cracks+=1;
        cracks=cracks.toString();

        var params={
            TableName:config.aws_table_name,
            Key:{"hash":{S:hash}},
            ExpressionAttributeNames:{"#C":"cracks","#U":"users"},
            ExpressionAttributeValues:{":n":{N:cracks},":vals":{L:[{"S":username}]}},
            ReturnValues:"ALL_NEW",
            UpdateExpression:"SET #C=:n,#U=list_append(#U,:vals)"
        }

        dynamodb.updateItem(params,function(err, data){
            if(err){
                res.json({message:""+err});
                console.log(err, err.stack);
                return;
            }
            console.log(data);
            res.json({message:"success"});
            return;
        });
    });
});

app.use("/keyme/api",router);
const options = {
        cert: fs.readFileSync('/etc/letsencrypt/live/www.phsc138.com/fullchain.pem'),
        key: fs.readFileSync('/etc/letsencrypt/live/www.phsc138.com/privkey.pem')
};

app.listen(port);
console.log("KeyMe-API started on port "+port+".");
