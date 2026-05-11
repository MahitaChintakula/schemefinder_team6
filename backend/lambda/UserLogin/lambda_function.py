import bcrypt
import json
import boto3

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('Users')

def lambda_handler(event, context):

    # CORS
    if event.get('httpMethod') == 'OPTIONS':

        return {

            'statusCode': 200,

            'headers': {

                'Access-Control-Allow-Origin': '*',

                'Access-Control-Allow-Headers': '*',

                'Access-Control-Allow-Methods': '*'
            },

            'body': json.dumps({})
        }

    try:

        print("EVENT:", event)

        # SAFE BODY HANDLING
        if 'body' in event:

            body = json.loads(event['body'])

        else:

            body = event

        email = body['email']

        password = body['password']

        # Check user
        response = table.get_item(

            Key={
                'email': email
            }
        )

        if 'Item' not in response:

            return {

                'statusCode': 404,

                'headers': {

                    'Access-Control-Allow-Origin': '*',

                    'Access-Control-Allow-Headers': '*',

                    'Access-Control-Allow-Methods': '*'
                },

                'body': json.dumps({

                    'message':
                    'User not found'
                })
            }

        user = response['Item']

        # Password check
       if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):

            return {

                'statusCode': 401,

                'headers': {

                    'Access-Control-Allow-Origin': '*',

                    'Access-Control-Allow-Headers': '*',

                    'Access-Control-Allow-Methods': '*'
                },

                'body': json.dumps({

                    'message':
                    'Invalid password'
                })
            }

        return {

            'statusCode': 200,

            'headers': {

                'Access-Control-Allow-Origin': '*',

                'Access-Control-Allow-Headers': '*',

                'Access-Control-Allow-Methods': '*'
            },

            'body': json.dumps({

                'message':
                'Login successful',

                'user': {

                    'email':
                    user['email'],

                    'fullName':
                    user['fullName']
                }
            })
        }

    except Exception as e:

        print(str(e))

        return {

            'statusCode': 500,

            'headers': {

                'Access-Control-Allow-Origin': '*',

                'Access-Control-Allow-Headers': '*',

                'Access-Control-Allow-Methods': '*'
            },

            'body': json.dumps({

                'error':
                str(e)
            })
        }
