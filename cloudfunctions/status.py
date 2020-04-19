from datetime import datetime

from flask import redirect
from google.cloud import bigquery


def insert_status(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    if request.method == 'POST':
        content_type = request.headers['content-type']
        if content_type != 'application/json':
            return "incorrect content type", 406

        if 'user-agent' not in request.headers:
            return "no user agent given", 500

        user_agent = request.headers['user-agent']
        request_json = request.get_json()
        if request_json and 'status' in request_json and 'uuid' in request_json:
            print("all fields in JSON found")
            client = bigquery.Client()
            table_id = "minimal-consent-chrome-ext.minimal_consent_production.status"
            table = client.get_table(table_id)  # Make an API request.

            # test for Version, not yet added to the database
            version = "no version"
            if 'version' in request_json:
                version = str(request_json["version"])

            rows_to_insert = [(datetime.now(), user_agent, request_json["status"], request_json["uuid"], version)]

            try:
                errors = client.insert_rows(table, rows_to_insert)  # Make an API request.
                if not errors:
                    return "ok", 200
                else:
                    print(errors)
                    print(request_json)
                    return "internal error.", 500
            except IndexError as ie:
                print("Index out of bound Exception: " + str(ie))
                return "internal error.", 500
            except Exception as e:
                print("An exception occurred: " + str(e))
                return "internal error.", 500

        else:
            print(request_json)
            return "internal error!", 500

    elif request.method == 'GET':
        if 'user-agent' not in request.headers:
            return "no user agent given", 500

        # test for Version, not yet added to the database
        version = request.args.get('version')
        if not version:
            version = "no version"

        uuid = request.args.get('uuid')
        user_agent = request.headers['user-agent']

        if uuid and user_agent:
            client = bigquery.Client()
            table_id = "minimal-consent-chrome-ext.minimal_consent_production.status"
            table = client.get_table(table_id)  # Make an API request.
            rows_to_insert = [(datetime.now(), user_agent, "uninstall", uuid, version)]
            errors = client.insert_rows(table, rows_to_insert)  # Make an API request.
            print("insert done of Status Record was done")
            if not errors:
                print("Insert okay of Uninstall")
            else:
                print(errors)
                print("Unable to insert after Uninstall")

        return redirect("https://www.minimal-consent.com")

    else:
        return "only POST & GET are allowed", 405
