from datetime import datetime

from google.cloud import bigquery


def insertSuccessfulConsent(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    if request.method != 'POST':
        return "only POST is allowed", 405

    # Construct a BigQuery client object.
    content_type = request.headers['content-type']
    if content_type != 'application/json':
        return "incorrect content type", 406

    if 'user-agent' not in request.headers:
        return "no user agent given", 500

    user_agent = request.headers['user-agent']

    request_json = request.get_json()
    if request_json and 'url' in request_json and 'cmp' in request_json and 'cmpScriptUrl' in request_json and 'pingResult' in request_json and 'implemented' in request_json:
        print("all fields in JSON found")
        client = bigquery.Client()
        table_id = "minimal-consent-chrome-ext.minimal_consent_production.successful_consent"
        table = client.get_table(table_id)  # Make an API request.

        # test for Version, not yet added to the database
        version = "no version"
        if 'version' in request_json:
            print("Version found (successful consent): " + str(request_json["version"]))
            version = str(request_json["version"])

        # test for UUID, not yet added to the database
        uuid = "no uuid"
        if 'uuid' in request_json:
            print("DeviceID (successful consent): " + str(request_json["uuid"]))
            uuid = str(request_json["uuid"])

        rows_to_insert = [(datetime.now(), user_agent, request_json["url"], request_json["cmp"],
                           request_json["cmpScriptUrl"], request_json["pingResult"], request_json["implemented"],
                           version, uuid)]
        errors = client.insert_rows(table, rows_to_insert)  # Make an API request.
        print("insert done")

        if not errors:
            return "ok", 200
        else:
            print(errors)
            print(request_json)
            return "internal error.", 500
    else:
        print(request_json)
        return "internal error!", 500
