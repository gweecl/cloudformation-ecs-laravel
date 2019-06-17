## Required artifacts in application repository

The application pipeline will build the docker images based on a `buildspec.yml` in the root directory, of the application repository. [Learn more](https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html).

This is an example that will build the ECR images (Laravel and Nginx) using Dockerfile and Docker Compose, in the Build stage, and update the ECS services in Deploy stage of the Codepipeline.

```
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws --version
      - $(aws ecr get-login --region ap-southeast-1 --no-include-email)
      - REPOSITORY_URI=$ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/$LARAVEL_REPOSITORY_NAME
      - NGINX_REPOSITORY_URI=$ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/$NGINX_REPOSITORY_NAME
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}
  build:
    commands:
      - echo Build started on `date`
      - |
        if [ "x$BUILD_ENV" = "xprod" ]; then
          cp ./docker/app/laravel.prod.env ./src/.env
          cp ./docker/nginx/default.ecs.prod.conf ./docker/nginx/default.conf
        else
          cp ./docker/app/laravel.dev.env ./src/.env
          cp ./docker/nginx/default.ecs.dev.conf ./docker/nginx/default.conf
        fi
      - echo Building the Docker image...
      - docker-compose build --no-cache
      - docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$IMAGE_TAG
      - docker tag $NGINX_REPOSITORY_URI:latest $NGINX_REPOSITORY_URI:$IMAGE_TAG
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:latest
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - docker push $NGINX_REPOSITORY_URI:latest
      - docker push $NGINX_REPOSITORY_URI:$IMAGE_TAG
      - echo Writing image definitions file...
      - |
        printf '[{"name":"php-laravel","imageUri":"%s"},{"name":"nginx","imageUri":"%s"}]' \
        $REPOSITORY_URI:$IMAGE_TAG $NGINX_REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json
artifacts:
    files: imagedefinitions.json
```

> Note that the Build Environment variables is fully customizable with application CodePipeline in CloudFormation. [Learn more](https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html).