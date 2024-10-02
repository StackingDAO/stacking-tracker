import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import { Duration } from "aws-cdk-lib";

import * as dotenv from "dotenv";
dotenv.config({ path: "cdk/.env" });

const domainName = process.env.DOMAIN ?? "stacking-tracker.com";

export class Web extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    cluster: ecs.Cluster,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // ECS Service
    const website = new ecsPatterns.ApplicationLoadBalancedEc2Service(
      this,
      "Website",
      {
        cluster: cluster,
        memoryReservationMiB: 512,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset("./web"),
          containerPort: 3000,
          environment: {
            NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
          },
        },
        desiredCount: 1, // Number of instances to run
        healthCheckGracePeriod: cdk.Duration.seconds(60), // Grace period before health checks start
        circuitBreaker: { enable: true, rollback: true },
      }
    );

    website.targetGroup.configureHealthCheck({
      path: "/", // Health check endpoint
      interval: cdk.Duration.seconds(30), // Health check interval
      timeout: cdk.Duration.seconds(5), // Timeout for health checks
      healthyThresholdCount: 2, // Number of consecutive successful health checks required
      unhealthyThresholdCount: 2, // Number of consecutive failed health checks required to mark as unhealthy
    });

    // Certificate and zone for domain
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "ImportedCert",
      process.env.CDK_AWS_CERTIFICATE_ARN ?? ""
    );
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "ImportZone",
      {
        hostedZoneId: process.env.CDK_AWS_HOSTEDZONE_ID ?? "",
        zoneName: domainName, // Replace with your actual zone name
      }
    );

    // Cache Policy
    const websiteCachePolicy = new cloudfront.CachePolicy(
      this,
      "WebsiteCachePolicy",
      {
        cachePolicyName: "WebsiteCachePolicy",
        defaultTtl: Duration.seconds(0), // Set the default TTL to 0 seconds
        minTtl: Duration.seconds(0), // Set the minimum TTL to 0 seconds
        maxTtl: Duration.seconds(3600), // Set the maximum TTL to 1 hour
        cookieBehavior: cloudfront.CacheCookieBehavior.none(), // Customize cookie caching
        headerBehavior: cloudfront.CacheHeaderBehavior.allowList(
          "Authorization",
          "Content-Type"
        ), // Customize header caching
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(), // Customize query string caching
        enableAcceptEncodingGzip: true,
        enableAcceptEncodingBrotli: true,
      }
    );

    // CloudFront Distribution
    const websiteDistribution = new cloudfront.Distribution(
      this,
      "WebsiteDistribution",
      {
        defaultBehavior: {
          origin: new origins.LoadBalancerV2Origin(website.loadBalancer, {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
          }),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
          cachePolicy: websiteCachePolicy,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        domainNames: [`www.${domainName}`],
        certificate: certificate,
        minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      }
    );

    // Add DNS records for the CloudFront distribution
    new route53.ARecord(this, "CloudFrontWeb", {
      zone: hostedZone,
      recordName: `www.${domainName}`,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(websiteDistribution)
      ),
    });
  }
}
