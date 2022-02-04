import {Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';

import {Code, Function as LambdaFunction, Runtime} from 'aws-cdk-lib/aws-lambda';
import {join} from 'path';
import {LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway';
import { GenericTable } from './GenericTable';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class SpaceStack extends Stack{

    private api = new RestApi(this,'SpaceApi');
    //private spaceTable = new GenericTable('SpaceTable','spaceId',this);

    private spaceTable = new GenericTable(this,{
        tableName: 'SpaceTable',
        primaryKey: 'spaceId',
        createLambdaPath: 'Create',
        readLambdaPath: 'Read',
        updateLambdaPath: 'Update',
        deleteLambdaPath: 'Delete',
        secondaryIndexes: ['location']
    })

    constructor(scope: Construct, id: string, props: StackProps){
        super(scope,id,props)
    
        // const helloLambda = new LambdaFunction(this, 'helloLambda',{
        //     runtime: Runtime.NODEJS_14_X,
        //     code: Code.fromAsset(join(__dirname,'..','services','hello')),
        //     handler: 'hello.main'
        // });

        const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs',{
            entry: join(__dirname,'..','services','node-lambda','hello.ts'),
            handler: 'handler'
        });

        const s3ListPolicy = new PolicyStatement();
        s3ListPolicy.addActions('s3:ListAllMyBuckets');
        s3ListPolicy.addResources('*');
        helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);

        //Hello Api lambda integration
        const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
        const helloLambdaResource = this.api.root.addResource('hello');
        helloLambdaResource.addMethod('GET',helloLambdaIntegration);

        //Spaces API integration
        const spaceLambdaResource = this.api.root.addResource('spaces');
        spaceLambdaResource.addMethod('POST',this.spaceTable.createLambdaIntegration);
        spaceLambdaResource.addMethod('GET',this.spaceTable.readLambdaIntegration);
        spaceLambdaResource.addMethod('PUT',this.spaceTable.deleteLambdaIntegration);
        spaceLambdaResource.addMethod('DELETE',this.spaceTable.deleteLambdaIntegration);
    }
}