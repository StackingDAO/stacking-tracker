import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";

import * as dotenv from "dotenv";
import { Duration } from "aws-cdk-lib";
dotenv.config({ path: "cdk/.env" });

const domainName = process.env.DOMAIN ?? "stacking-tracker.com";

export class CloudFront extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hostedZone = new route53.HostedZone(this, "WebsiteZone", {
      zoneName: domainName,
    });

    const certificate = new acm.Certificate(this, "WebsiteCertificate", {
      domainName: `*.${domainName}`,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

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
          origin: new origins.HttpOrigin(`www.${domainName}`, {
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

    // Cache Policy
    const apiCachePolicy = new cloudfront.CachePolicy(this, "ApiCachePolicy", {
      cachePolicyName: "ApiCachePolicy",
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
    });

    // CloudFront Distribution
    const apiDistribution = new cloudfront.Distribution(
      this,
      "ApiDistribution",
      {
        defaultBehavior: {
          origin: new origins.HttpOrigin(`api.${domainName}`, {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
          }),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
          cachePolicy: apiCachePolicy,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        domainNames: [`api.${domainName}`],
        certificate: certificate,
        minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      }
    );

    // Add DNS records for the CloudFront distribution
    new route53.ARecord(this, "CloudFrontApi", {
      zone: hostedZone,
      recordName: `api.${domainName}`,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(apiDistribution)
      ),
    });
  }
}
