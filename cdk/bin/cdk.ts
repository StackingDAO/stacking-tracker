#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Tracker } from "../lib/tracker";

const app = new cdk.App();
const env = {};

new Tracker(app, "Tracker", { env });
