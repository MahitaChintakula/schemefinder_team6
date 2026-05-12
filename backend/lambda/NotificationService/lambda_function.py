import json
import boto3

sns = boto3.client('sns')

def lambda_handler(event, context):

    message = event['message']
    phone = event['phone']

    sns.publish(
        PhoneNumber=phone,
        Message=message
    )

    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Notification sent'
        })
    }
