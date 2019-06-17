
## Uploading nested template to an S3 Bucket

Before uploading root template, you have to upload the child template to S3 and replace the `templateURL` propertise with the s3 URL for `AWS::CloudFormation::Stack`.

You can make this easier with [Cloudformation package](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/package.html) command.

Specify local url in template source:
```
TemplateURL: "./cf-archival-newspost-app-pipeline.yaml"
```

Run the command:
```
aws cloudformation package --template-file $CF_TEMPLATE_FILE_NAME \
        --s3-bucket $CODEPIPELINE_S3_BUCKET_NAME \
        --s3-prefix cf-stacks-template \
        --output-template-file transformed-$CF_TEMPLATE_FILE_NAME
```

The command saves the template that it generates to the path specified by the --output option. And replaces the `TemplateURL` with the S3 location.