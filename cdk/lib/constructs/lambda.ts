import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export interface LambdaProps {
    /** The root directory in which the lambda's package.json is situated */
    lambdaRootDir: string;
    /** The path from the root directory to the file in which the lambda's handler is */
    handlerFilePath: string;
    /** The name of the exproted function that acts as a lambda */
    handler?: string;
    /** custom environment variables */
    environment?: Record<string, string>;
    /** memory reservation in MB */
    memory?: number;
    /** The maximum time the function should run */
    timeout?: Duration;
}

export class TypeScriptLambda extends Construct {
    public readonly props: LambdaProps;
    public readonly lambda: lambda.NodejsFunction;
    constructor(scope: Construct, id: string, props: LambdaProps) {
        super(scope, id);
        this.props = props;

        this.lambda = new lambda.NodejsFunction(this, "lambda", {
            entry: this.getHandlerModulePath(
                props.lambdaRootDir,
                props.handlerFilePath
            ),
            handler: props.handler,
            timeout: props.timeout || Duration.minutes(10),
            depsLockFilePath: `${props.lambdaRootDir}/package-lock.json`,
            runtime: Runtime.NODEJS_20_X,
            memorySize: props.memory || 512,
            environment: props.environment,
        });
    }

    private getHandlerModulePath(
        rootFolderPath: string,
        moduleFileName: string
    ) {
        return `${rootFolderPath}/${moduleFileName}`;
    }
}
