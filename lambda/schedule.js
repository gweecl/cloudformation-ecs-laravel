
var AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

exports.handler = function (event, context) {
    console.log('*******************EVENT*******************');    
    console.log(event);    
    console.log('*******************CONTEXT*******************');    
    console.log(context);    

    if(event.status == 'stop'){
        var params = {
            cluster: process.env.ECS_CLUSTER,
            service: process.env.ECS_SERVICE_NAME,
            desiredCount: 0
        };
    }
    else{
        var params = {
            cluster: process.env.ECS_CLUSTER,
            service: process.env.ECS_SERVICE_NAME,
            desiredCount: 1
        };
    }
    
    var ecs = new AWS.ECS();
    ecs.updateService(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
};