##  Enable HTTPS support

Add a AWS Certificate Manager resources with [Conditions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/conditions-section-structure.html), so that it will only create in Production environment.

```
HttpsCertificate:
    Type: AWS::CertificateManager::Certificate
    Condition: CreateProdResources
    Properties: 
      DomainName: !Ref ApplicationDomainName
      DomainValidationOptions:
        - DomainName: !Ref ApplicationDomainName
          ValidationDomain: !Ref ApplicationDomainName
      ValidationMethod: DNS
```

Please note that upon `AWS::CertificateManager::Certificate` resources creation, the stack will remain in the CREATE_IN_PROGRESS state and any further stack operations will be delayed until you validate the certificate request.

In this case, adding a CNAME record to your DNS configuration and wait for a success validation.

