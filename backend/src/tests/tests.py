import json
import pytest
from src.app import app, db

def test_get_shopping_list(client):
    # Clear the items collection before running the test
    db.items.delete_many({})

    response = client.get("/api/shopping-list")
    assert response.status_code == 200
    assert response.is_json
    assert response.json == []

def test_add_to_shopping_list(client):
    # Clear the items collection before running the test
    db.items.delete_many({})

    response = client.post(
        "/api/shopping-list",
        json={"name": "apple"},
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 200
    assert response.is_json

    response = client.get("/api/shopping-list")

@pytest.fixture
def client():
    app.testing = True
    client = app.test_client()
    yield client

