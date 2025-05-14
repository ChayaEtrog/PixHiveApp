import requests
from flask import Flask, request, jsonify
from flask_cors  import CORS

app = Flask(__name__)
CORS(app) 

import os
from dotenv import load_dotenv

load_dotenv()
DEEPAI_API_KEY = os.getenv("API_KEY")

from deep_translator import GoogleTranslator

def translate_to_english(text: str) -> str:
    try:
        translated = GoogleTranslator(source='auto', target='en').translate(text)
        return translated
    except Exception as e:
        return f"Translation failed: {e}"
    
@app.route('/process-image', methods=['POST'])
def process_image():
    prompt = request.form.get("prompt")
    image = request.form.get("image")

    if not prompt:
        return jsonify({"error": "Missing prompt"}), 400
    if not image:
        return jsonify({"error": "Missing image"}), 400

    translated_prompt = translate_to_english(prompt)
    if translated_prompt.startswith("Translation failed:"):
        return jsonify({"error": translated_prompt}), 500

    response = requests.post(
        "https://api.deepai.org/api/image-editor",
        data={
            'image': image,
            'text': translated_prompt,
        },
        headers={'api-key': '404bec69-c139-43b2-ab05-011145608097'}
    )

    if response.status_code != 200:
        return jsonify({"error": "Failed to process image"}), 500

    return jsonify(response.json())

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)