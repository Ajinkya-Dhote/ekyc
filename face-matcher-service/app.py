from flask import Flask, request, jsonify
import face_recognition
import base64
import numpy as np

app = Flask(__name__)

@app.route("/match", methods=["POST"])
def match_faces():
    print(request)
    # Load the input images
    image1 = face_recognition.load_image_file(request.files["image1"])
    image2 = face_recognition.load_image_file(request.files["image2"])

    # Preprocess the input images and extract their face encodings
    face_encodings1 = face_recognition.face_encodings(image1)[0]
    face_encodings2 = face_recognition.face_encodings(image2)[0]

    # Compare the face encodings and calculate the similarity score
    face_distance = face_recognition.face_distance([face_encodings1], face_encodings2)
    similarity_score = 1 - face_distance[0]

    # Return the similarity score as a JSON response
    return jsonify({"similarity_score": similarity_score})

@app.route("/process_image", methods=["POST"])
def match_base64_faces():
    print(request.files)
    if 'image1' not in request.files or 'image2' not in request.files:
        return jsonify({'error': 'Missing image file(s)'}), 400
    #convert the bas64 image
   
    # Load the input images
    image1_file = request.files["image1"]
    image1_data = image1_file.read()

    image2_file = request.files["image2"]
    image2_data = image2_file.read()

    image1 = face_recognition.load_image_file(image1_data)
    image2 = face_recognition.load_image_file(image2_data)

    # Preprocess the input images and extract their face encodings
    face_encodings1 = face_recognition.face_encodings(image1)
    face_encodings2 = face_recognition.face_encodings(image2)

    # Compare the face encodings and calculate the similarity score
    face_distance = face_recognition.face_distance([face_encodings1], face_encodings2)
    similarity_score = 1 - face_distance[0]

    # Return the similarity score as a JSON response
    return jsonify({"similarity_score": similarity_score})

if __name__ == "__main__":
    app.run(debug=True)