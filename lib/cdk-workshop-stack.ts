import { Duration, Stack, StackProps, lambda_layer_awscli } from 'aws-cdk-lib';

import * as lambda from'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs';
import {HitCounter} from './hitconter';

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler'
    })
 
    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    })

    hello.grantInvoke(helloWithCounter.handler)

    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler
    })
  }

}
