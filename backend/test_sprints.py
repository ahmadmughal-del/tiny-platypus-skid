import requests
import json

BASE_URL = "http://localhost:8000/api/v1"
TEST_USER = {"email": "testuser@example.com", "password": "password"}
AUTH_TOKEN = ""
SPRINT_ID = ""

def register_and_login():
    global AUTH_TOKEN
    # Try to register, ignore if user already exists
    requests.post(f"{BASE_URL}/auth/register", json=TEST_USER)
    
    # Login to get token
    login_response = requests.post(f"{BASE_URL}/auth/token", data={"username": TEST_USER["email"], "password": TEST_USER["password"]})
    if login_response.status_code == 200:
        AUTH_TOKEN = login_response.json()["access_token"]
        print("Login successful.")
    else:
        print(f"Login failed: {login_response.text}")
        exit()

def create_sprint():
    global SPRINT_ID
    headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}
    sprint_data = {"initial_dump": "This is the initial content of the sprint."}
    response = requests.post(f"{BASE_URL}/sprints/", headers=headers, json=sprint_data)
    if response.status_code == 200:
        SPRINT_ID = response.json()["_id"]
        print(f"Sprint created with ID: {SPRINT_ID}")
    else:
        print(f"Failed to create sprint: {response.text}")
        exit()

def finalize_sprint():
    headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}
    response = requests.post(f"{BASE_URL}/sprints/{SPRINT_ID}/finalize", headers=headers)
    if response.status_code == 200:
        print("Sprint finalized successfully.")
        print("Response:", json.dumps(response.json(), indent=2))
    else:
        print(f"Failed to finalize sprint: {response.text}")

if __name__ == "__main__":
    register_and_login()
    create_sprint()
    finalize_sprint()