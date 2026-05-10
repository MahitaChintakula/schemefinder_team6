import boto3
import json
from decimal import Decimal

# =========================
# DECIMAL JSON ENCODER
# =========================
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            # Convert Decimal to int/float
            if obj % 1 == 0:
                return int(obj)
            return float(obj)

        return super(DecimalEncoder, self).default(obj)


# =========================
# DYNAMODB SETUP
# =========================
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("schemes")


# =========================
# LAMBDA HANDLER
# =========================
def lambda_handler(event, context):

    try:

        # =========================
        # HANDLE CORS PREFLIGHT
        # =========================
        if event.get("httpMethod") == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "GET,OPTIONS"
                },
                "body": json.dumps({"message": "CORS OK"})
            }

        # =========================
        # FETCH ALL SCHEMES
        # =========================
        response = table.scan()

        items = response.get("Items", [])

        print("Fetched schemes count:", len(items))

        # =========================
        # SUCCESS RESPONSE
        # =========================
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET,OPTIONS"
            },
            "body": json.dumps(items, cls=DecimalEncoder)
        }

    except Exception as e:

        print("ERROR:", str(e))

        # =========================
        # ERROR RESPONSE
        # =========================
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET,OPTIONS"
            },
            "body": json.dumps({
                "error": str(e)
            })
        }