import boto3
import json
import uuid

def lambda_handler(event, context):
    try:
        user_data = json.loads(event['body'])
        user_data['user_id'] = str(uuid.uuid4())
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('users')
        table.put_item(Item=user_data)
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': json.dumps({
                'message': 'Profile saved successfully',
                'user_id': user_data['user_id']
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }