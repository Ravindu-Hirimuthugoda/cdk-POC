import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/SpaceTable/Delete";

// const event: APIGatewayProxyEvent = {
//     queryStringParameters: {
//         //spaceId: '711a6ad6-013c-4470-a6c3-dbe7383610e4'
//         location: '99x'
//     }
// }as any;

// const event: APIGatewayProxyEvent = {
//     queryStringParameters: {
//         spaceId: '711a6ad6-013c-4470-a6c3-dbe7383610e4'
//     },
//     body:{
//         description: 'updated to new place in galle road'
//     }
// }as any;

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        spaceId: '711a6ad6-013c-4470-a6c3-dbe7383610e4'
    }
}as any;


const result = handler(event,{} as any).then((apiResult)=>{
    const items = JSON.parse(apiResult.body);
    console.log(123);
});