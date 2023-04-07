FROM python:3.9-slim-buster
RUN apt-get update
RUN apt-get -y install build-essential cmake libopenblas-dev liblapack-dev libjpeg-dev libpng-dev libtiff-dev libavcodec-dev libavformat-dev libswscale-dev libv4l-dev libxvidcore-dev libx264-dev libgtk-3-dev
RUN pip install --upgrade pip
RUN pip install dlib

# WORKDIR /app

# COPY requirements.txt requirements.txt
# RUN pip3 install -r requirements.txt

# COPY app.py app.py

# ENV FLASK_APP=app.py

# EXPOSE 5000

# CMD ["flask", "run", "--host=0.0.0.0"]