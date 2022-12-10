from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


client = MongoClient("mongodb://localhost:27017")
db = client.shopping_list

@app.route("/api/shopping-list", methods=["GET"])
def get_shopping_list():
    items = list(db.items.find())

    for item in items:
        item["id"] = str(item["_id"])
        del item["_id"]
    return jsonify(items)

@app.route("/api/shopping-list/<item_id>", methods=["PUT"])
def update_item(item_id):
  # Get the updated item data from the request body
  updated_item = request.get_json()

  # Update the item in the database
  db.items.replace_one({"_id": item_id}, updated_item)

  # Return the updated item
  return jsonify(updated_item)

@app.route("/api/shopping-list", methods=["POST"])
def add_to_shopping_list():
    data = request.json
    result = db.items.insert_one(data)
    return jsonify({"id": str(result.inserted_id)})

if __name__ == "__main__":
    app.run()

