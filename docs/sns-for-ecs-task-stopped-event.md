## Sending Amazon Simple Notification Service Alerts for Task Stopped Events

#### Example CloudFormation snippet in YAML

```yaml
  SNSTopicForEcs:
      Type: AWS::SNS::Topic
      Properties: 
        DisplayName: <YOU-DISPLAY-NAME>
        Subscription: 
          - Endpoint: <YOU-EMIAL-TO-RECEIVE-ALERT>
            Protocol: Email

  EventRuleForEcs:
    Type: AWS::Events::Rule
    Properties: 
      Description: Captures ECS task events where the task has stopped running under ECS cluster. 
      EventPattern: !Sub 
        - |
          {
            "source": [
              "aws.ecs"
            ],
            "detail-type": [
              "ECS Task State Change"
            ],
            "detail": {
              "clusterArn": [ 
                "${ECSClusterArn}" 
              ],
              "lastStatus": [
                "STOPPED"
              ]
            }
          }
        - { ECSClusterArn: <YOU-ECS-CLUSTER-ARN> }
      State: ENABLED
      Targets: 
        - Arn: !Ref SNSTopicForEcs
          Id: "TargetSNSTopicV1"
```

You can customize the `detail` section according to the [Task](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_Task.html) 
object that is returned from a [DescribeTasks](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_DescribeTasks.html) 
API operation in the Amazon Elastic Container Service API Reference).

Learn more on ECS Task State Change Events [here](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_cwe_events.html#ecs_task_events).

#### Reference
- [AWS Tutorial](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_cwet2.html)
