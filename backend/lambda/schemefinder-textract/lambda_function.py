import json
import boto3
import re
from datetime import datetime

# AWS CLIENTS
textract = boto3.client('textract')
dynamodb = boto3.resource('dynamodb')

# DYNAMODB TABLE
table = dynamodb.Table('schemes')

def lambda_handler(event, context):

    try:

        # =========================
        # GET FILE DETAILS
        # =========================

        print("EVENT:")
        print(event)

        bucket = event['bucket_name']
        key = event['file_name']

        print("Bucket:", bucket)
        print("File:", key)

        # =========================
        # TEXTRACT OCR
        # =========================

        response = textract.detect_document_text(
            Document={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': key
                }
            }
        )

        extracted_text = ""

        for item in response["Blocks"]:

            if item["BlockType"] == "LINE":
                extracted_text += item["Text"] + "\n"

        print("Extracted Text:")
        print(extracted_text)

        # =========================
        # LOWERCASE TEXT
        # =========================

        text_lower = extracted_text.lower()

        # =========================
        # USER DETAIL EXTRACTION
        # =========================

        age = None
        gender = ""
        state = ""
        occupation = ""
        income = 0

        # =========================
        # AGE FROM DOB
        # =========================

        dob_match = re.search(
            r'(\d{2})/(\d{2})/(\d{4})',
            extracted_text
        )

        if dob_match:

            birth_year = int(
                dob_match.group(3)
            )

            current_year = datetime.now().year

            age = current_year - birth_year

        print("Age:", age)

        # =========================
        # GENDER
        # =========================

        if "female" in text_lower:
            gender = "female"

        elif "male" in text_lower:
            gender = "male"

        print("Gender:", gender)

        # =========================
        # STATE DETECTION
        # =========================

        states = [
            "andhra pradesh",
            "telangana",
            "karnataka",
            "tamil nadu",
            "kerala",
            "maharashtra",
            "delhi"
        ]

        for s in states:

            if s in text_lower:
                state = s
                break

        print("State:", state)

        # =========================
        # OCCUPATION
        # =========================

        if "student" in text_lower:
            occupation = "student"

        elif "farmer" in text_lower:
            occupation = "farmer"

        elif "employee" in text_lower:
            occupation = "employee"

        print("Occupation:", occupation)

        # =========================
        # INCOME
        # =========================

        income = 0

        print("Income not found in Aadhaar")

        # =========================
        # DEBUG FINAL VALUES
        # =========================

        print("FINAL EXTRACTED AGE:", age)
        print("FINAL EXTRACTED GENDER:", gender)
        print("FINAL EXTRACTED STATE:", state)
        print("FINAL EXTRACTED OCCUPATION:", occupation)

        # =========================
        # DYNAMODB SCHEME MATCHING
        # =========================

        matched_schemes = []

        db_response = table.scan()

        items = db_response['Items']

        print("Total Schemes:", len(items))

        for scheme in items:

            scheme_name = scheme.get(
                'scheme_name',
                'Unknown Scheme'
            )

            scheme_gender = scheme.get(
                'gender',
                'any'
            ).lower()

            scheme_state = scheme.get(
                'state',
                'all'
            ).lower()

            scheme_occupation = scheme.get(
                'occupation',
                'any'
            ).lower()

            min_age = int(
                scheme.get('min_age', 0)
            )

            max_age = int(
                scheme.get('max_age', 100)
            )

            max_income = int(
                scheme.get('max_income', 999999999)
            )

            age_match = (
                age is not None
                and min_age <= age <= max_age
            )

            gender_match = (
                scheme_gender == gender
                or scheme_gender == "any"
            )

            state_match = (
                scheme_state == state
                or scheme_state == "all"
            )

            occupation_match = (
                scheme_occupation == occupation
                or scheme_occupation == "any"
                or occupation == ""
            )

            income_match_condition = (
                income <= max_income
            )

            print("Checking:", scheme_name)
            print("Age Match:", age_match)
            print("Gender Match:", gender_match)
            print("State Match:", state_match)
            print("Occupation Match:", occupation_match)
            print("Income Match:", income_match_condition)
            print("----------------------")

            # =========================
            # SMART MATCHING
            # =========================

            if (
                gender_match
                and income_match_condition
                and state_match
                and (
                    occupation_match
                    or age_match
                )
            ):

                matched_schemes.append({

                    "scheme_name": scheme.get(
                        "scheme_name",
                        ""
                    ),

                    "description": scheme.get(
                        "description",
                        ""
                    ),

                    "required_documents": (

                        scheme.get(
                            "required_documents",
                            ""
                        ).split(",")

                        if isinstance(
                            scheme.get(
                                "required_documents",
                                ""
                            ),
                            str
                        )

                        else scheme.get(
                            "required_documents",
                            []
                        )
                    ),

                    "tags": (

                        scheme.get(
                            "tags",
                            ""
                        ).split(",")

                        if isinstance(
                            scheme.get(
                                "tags",
                                ""
                            ),
                            str
                        )

                        else scheme.get(
                            "tags",
                            []
                        )
                    ),

                    "website": scheme.get(
                        "website",
                        "#"
                    )

                })

        # =========================
        # FALLBACK
        # =========================

        if len(matched_schemes) == 0:

            matched_schemes.append({

                "scheme_name":
                    "No eligible schemes found",

                "description":
                    "",

                "required_documents":
                    [],

                "tags":
                    [],

                "website":
                    "#"

            })

        print("Matched Schemes:")
        print(matched_schemes)

        # =========================
        # RESPONSE
        # =========================

        return {

            'statusCode': 200,

            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': '*'
            },

            'body': json.dumps({

                'success': True,

                'eligibleSchemes': matched_schemes

            })
        }

    except Exception as e:

        print("ERROR:")
        print(str(e))

        return {

            'statusCode': 500,

            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': '*'
            },

            'body': json.dumps({

                'success': False,

                'error': str(e)

            })
        }