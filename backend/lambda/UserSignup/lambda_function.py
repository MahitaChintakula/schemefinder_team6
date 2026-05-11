import bcrypt
import json
import boto3


dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('Users')

def lambda_handler(event, context):

    print("EVENT:", event)

    try:

        # SAFE BODY PARSING
        if 'body' in event:

            body = json.loads(event['body'])

        else:

            body = event

        print("BODY:", body)

        email = body['email']

        # Check existing user
        existing_user = table.get_item(

            Key={
                'email': email
            }
        )

        if 'Item' in existing_user:

            return {

                'statusCode': 400,

                'headers': {

                    'Access-Control-Allow-Origin': '*'
                },

                'body': json.dumps({

                    'message':
                    'User already exists'
                })
            }

        # SAVE USER
        table.put_item(

            Item={

                'email': email,

                'fullName':
                body['fullName'],

                'password': bcrypt.hashpw(body['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            }
        )

        return {

            'statusCode': 200,

            'headers': {

                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps({

                'message':
                'Signup successful'
            })
        }

    except Exception as e:

        print("ERROR:", str(e))

        return {

            'statusCode': 500,

            'headers': {

                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps({

                'error':
                str(e)
            })
        }
