const {PerformanceObserver,performance}=require('perf_hooks');
var sechash=require('sechash');

var opts={
    algorithm:'sha256',
    iterations:5000,
    salt:'salt'
};

// This will hash the string quite a bit more strongly.
//var hash=sechash.strongHashSync('Your String',opts);

var t0=performance.now();
// As of version 0.2.0, basic promise-style callbacks (using oath) are also
// supported on async functions (strongHash and testHash).
var hash=sechash.strongHash('Your String',opts).then(function(hash){
    var t1=performance.now();
    console.log("Hash: "+hash+" took "+(t1-t0)+" milliseconds.")
});


//TESTING the hash

// First we generate a hash...
var hash=sechash.strongHashSync('Your String',opts);

// To test if a string matches a hash, we you the testHash method
sechash.testHashSync('Your String',hash,opts);    // true
sechash.testHashSync('Another String',hash,opts); // false

// Again, this function also has an async form...
sechash.testHash('Your String',hash,opts,function(err,isMatch){
    console.log(isMatch); // true
});
