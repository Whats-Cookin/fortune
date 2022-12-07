import os
import json
import uvicorn
from fastapi import FastAPI, HTTPException, status
from db import cursor

PORT = os.getenv('GET_QUERY_PORT', 8000)
DB_TABLE_GITHUB = os.getenv('DB_TABLE_GITHUB')
DB_TABLE_FIVERR = os.getenv('DB_TABLE_FIVERR')
DB_TABLE_PLATFORM_API_KEY = os.getenv('DB_TABLE_PLATFORM_API_KEY')
DB_TABLE_PLATFORM_RATING = os.getenv('DB_TABLE_PLATFORM_RATING')
app = FastAPI()


@app.get("/get-github-profile/{user_acount}")
def get_github_profile(user_acount):
    # TECHDEBT
    # This API will be removed once composedb implements the feature to query with fields
    # https://forum.ceramic.network/t/queries-by-fields/260/6
    query = f'''
        SELECT stream_id, stream_content 
        FROM {DB_TABLE_GITHUB} 
        WHERE json_extract(stream_content, '$.user_account')="{user_acount}"
    '''
    result = None
    try:
        result = cursor.execute(query).fetchone()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Something went wrong.")

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Github profile with user_account: {user_acount} not found")
    id, json_string = result
    github_profile = json.loads(json_string)
    github_profile["id"] = id

    return github_profile


@app.get("/hashed-api-key/{platform}")
def get_github_profile(platform):
    # TECHDEBT
    # This API will be removed once composedb implements the feature to query with fields
    # https://forum.ceramic.network/t/queries-by-fields/260/6
    query = f'''
        SELECT stream_id, stream_content 
        FROM {DB_TABLE_PLATFORM_API_KEY} 
        WHERE json_extract(stream_content, '$.platform')="{platform}"
    '''
    result = None
    try:
        result = cursor.execute(query).fetchone()
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Something went wrong.")

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Api key for platform: {platform} not found")
    id, json_string = result
    record = json.loads(json_string)
    record["id"] = id

    return record


@app.get("/platform-rating/{platform}/{user_id}")
def get_github_profile(platform, user_id):
    # TECHDEBT
    # This API will be removed once composedb implements the feature to query with fields
    # https://forum.ceramic.network/t/queries-by-fields/260/6
    query = f'''
        SELECT stream_id, stream_content
        FROM {DB_TABLE_PLATFORM_RATING}
        WHERE json_extract(stream_content, '$.platform_name')="{platform}" 
        AND json_extract(stream_content, '$.user_id')="{user_id}"
    '''
    result = None
    try:
        result = cursor.execute(query).fetchone()
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Something went wrong.")

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Api key for platform: {platform} not found")
    id, json_string = result
    record = json.loads(json_string)
    record["id"] = id

    return record


if __name__ == "__main__":
    uvicorn.run("main:app", port=int(PORT), reload=True, host="0.0.0.0")
