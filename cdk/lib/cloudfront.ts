import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";

import * as dotenv from "dotenv";
dotenv.config({ path: "cdk/.env" });

const domainName = process.env.DOMAIN ?? "stacking-tracker.com";

export class CloudFront extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // HostedZone for entire project
    const hostedZone = new route53.HostedZone(this, "WebsiteZone", {
      zoneName: domainName,
    });

    // Certificate for all subdomains
    new acm.Certificate(this, "WebsiteCertificate", {
      domainName: `*.${domainName}`,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // Redirect certificate for root domain to www subdomain
    const certificateRoot = new acm.Certificate(
      this,
      "WebsiteRootCertificate",
      {
        domainName: `${domainName}`,
        validation: acm.CertificateValidation.fromDns(hostedZone),
      }
    );

    // Redirect (non-www to www) function
    const redirectFunction = new cloudfront.Function(this, "RedirectFunction", {
      code: cloudfront.FunctionCode.fromInline(`
        function handler(event) {
          var request = event.request;
          var headers = request.headers;

          if (headers.host && headers.host.value === '${domainName}') {
            return {
              statusCode: 301,
              statusDescription: 'Moved Permanently',
              headers: { 
                "location": { "value": "https://www.${domainName}" + request.uri }
              }
            };
          }
          return request;
        }
      `),
    });

    // Redirect distribution
    const redirectDistribution = new cloudfront.Distribution(
      this,
      "RedirectDistribution",
      {
        defaultBehavior: {
          origin: new origins.HttpOrigin(`www.${domainName}`, {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
          }),
          functionAssociations: [
            {
              function: redirectFunction,
              eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            },
          ],
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        domainNames: [`${domainName}`],
        certificate: certificateRoot,
        minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      }
    );

    // Redirect DNS record
    new route53.ARecord(this, "RedirectRecord", {
      zone: hostedZone,
      recordName: `${domainName}`,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(redirectDistribution)
      ),
    });

    // SPF record to specify authorized email servers
    new route53.TxtRecord(this, "SpfRecord", {
      zone: hostedZone,
      recordName: `${domainName}`,
      values: [
        "v=spf1 -all", 
      ],
    });

    // DMARC record to specify email authentication policy
    new route53.TxtRecord(this, "DmarcRecord", {
      zone: hostedZone,
      recordName: `_dmarc.${domainName}`,
      values: [
        "v=DMARC1; p=reject; rua=mailto:dmarc-reports@${domainName}; ruf=mailto:dmarc-reports@${domainName}; fo=1; adkim=s; aspf=s; pct=100; rf=afrf; ri=86400",
      ],
    });
  }
}
