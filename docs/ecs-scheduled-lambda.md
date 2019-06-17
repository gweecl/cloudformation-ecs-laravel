## Cost-Efficient ECS services with Scheduled Lambda

### Background

Get ECS scheduled task running or starting can easily be enabled from ECS Task Scheduler or CloudWatch Events. [Learn more](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/scheduled_tasks.html).

But for STOPPING Tasks, I cannot find any. However, I can manually set `DesiredCount` in ECS service to 0. [Learn more](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service_definition_parameters.html).

The goal is to schedule ECS Container service to run on 9am - 6pm only, thus, cost-efficient for development environment.

------

### Solution

This solution will create the following resources:

- A lambda function, to start or stop by update the ECS service `DesiredCount`.
- A scheduled CloudWatch Events, to start the ECS tasks.
- A scheduled CloudWatch Events, to stop the ECS tasks.


Lambda Function that will start or stop the ECS service based on the input from CloudWatch Events:
```
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
```

In Cloudformation template, create resources that will invoke the Lambda Function on a schedule:
```
  StartEcsLambdaSchedule:
    Type: AWS::Events::Rule
    Properties:
      Description: >
        A schedule for the Lambda function to start ECS service during office hours.
      ScheduleExpression: !Ref StartEcsLambdaScheduleExpression
      State: ENABLED
      Targets:
        - Arn: !Sub ${EcsTaskScheduleLambdaFunction.Arn}
          Id: StartEcsLambdaScheduleV1
          Input: '{"status": "start"}'
  
  StopEcsLambdaSchedule:
    Type: AWS::Events::Rule
    Properties:
      Description: >
        A schedule for the Lambda function to stop ECS service after office hours.
      ScheduleExpression: !Ref StopEcsLambdaScheduleExpression
      State: ENABLED
      Targets:
        - Arn: !Sub ${EcsTaskScheduleLambdaFunction.Arn}
          Id: StopEcsLambdaScheduleV1
          Input: '{"status": "stop"}'
```