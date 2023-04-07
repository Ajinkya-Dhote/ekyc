import { Box, Fab } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Webcam from "react-webcam";
import { useEffect, useRef, useState } from 'react';
import * as facemesh from "@tensorflow-models/facemesh";
import AddPhotoIcon from "@mui/icons-material/AddAPhoto";

const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user",
    aspectRatio: 1.6,
};

export default function Home() {
    const webcamRef = useRef(null);
    const [model, setModel] = useState(null);
    const [uploadImage, setUploadImage] = useState(null);
    const [uploadImageURL, setUploadImageURL] = useState(null);

    useEffect(() => {
        async function loadFacemesh() {
            const loadedModel = await facemesh.load({
                maxFaces: 1, // Only track one face
            });
            setModel(loadedModel);
        }
        loadFacemesh();
    }, []);

    useEffect(() => {
        if (model !== null) {
            runFacemesh();
        }

    }, [model]);

    const drawFaceMesh = async (predictions, ctx) => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
            // Get video properties
            const video = webcamRef.current.video;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            // Set canvas dimensions to match video dimensions
            const canvas = ctx.canvas;
            canvas.width = videoWidth;
            canvas.height = videoHeight;

            // Get predicted face mesh
            const faceMesh = predictions[0].scaledMesh;

            // Draw the face mesh on the canvas
            for (let i = 0; i < faceMesh.length; i++) {
                if (i % 5 === 0) continue;
                const x = faceMesh[i][0];
                const y = faceMesh[i][1];

                ctx.beginPath();
                ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
                ctx.fillStyle = "aqua";
                ctx.fill();
            }
        }
    };

    const runFacemesh = async () => {
        // Get video properties
        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // Set canvas dimensions to match video dimensions
        const canvas = document.getElementById("canvas");
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        const facectx = canvas.getContext("2d");

        // Get predictions from facemesh model
        const predictions = await model.estimateFaces(video);

        // Get canvas 2D context
        const ctx = canvas.getContext("2d");

        // Draw face mesh on canvas
        if (predictions.length > 0) {
            // drawMesh(predictions, ctx);
            // drawFaceMesh(predictions, ctx);
            drawReactangle(predictions, facectx);
        }
        setTimeout(() => requestAnimationFrame(runFacemesh), 200)

    };

    const drawReactangle = (predictions, ctx) => {

        const { bottomRight, topLeft } = predictions[0].boundingBox
        const width = bottomRight[0] - topLeft[0];
        const heigth = bottomRight[1] - topLeft[1];
        const x = topLeft[0];
        const y = topLeft[1];


        ctx.rect(x, y, heigth, width);
        ctx.strokeStyle = 'red';
        ctx.stroke();

    }

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();


        const formData = new FormData();
        const imageBlob = dataURItoBlob(imageSrc);
        const imageFile = new File([imageBlob], 'image.jpg', { type: 'image/jpeg' });

        formData.append('image1', imageFile);
        formData.append('image2', uploadImage);


        fetch('/match', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
            })
            .catch(error => {
                console.error('Error:', error);
            });



    }

    function dataURItoBlob(dataURI) {
        // Split the data URI into the MIME type and data
        const [mime, data] = dataURI.split(';base64,');

        // Convert the base64 data to a binary string
        const binary = atob(data);

        // Create a Uint8Array from the binary string
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
        }

        // Create a Blob object from the Uint8Array and MIME type
        return new Blob([array], { type: mime.split(':')[1] });
    }

    const imageHandler = (e) => {
        console.log("image upload", e.target.files[0]);
        setUploadImage(e.target.files[0])
        setUploadImageURL(URL.createObjectURL(e.target.files[0]))
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} >
                <Grid xs={6} justifyContent="center" alignItems="center">
                    <img src={uploadImageURL} width={400} height={400}></img>
                    <Fab color="primary" aria-label="add-image" sx={{ position: "relative", bottom: 16, right: 16, overflow: "hidden" }}>
                        <input
                            type="file"
                            onChange={imageHandler}
                            accept="image/*"
                            multiple
                            style={{ //make this hidden and display only the icon
                                position: "absolute",
                                top: "-35px",
                                left: 0,
                                height: "calc(100% + 36px)",
                                width: "calc(100% + 5px)",
                                outline: "none",
                            }}
                        />

                        <AddPhotoIcon />
                    </Fab>
                </Grid>
                <Grid xs={6} justifyContent="center" alignItems="center">
                    <Webcam ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        style={{
                            // position: "absolute",
                            marginLeft: "auto",
                            marginRight: "auto",
                            left: 0,
                            right: 0,
                            // textAlign: "center",
                            zindex: 9,
                            width: 400,
                            height: 400
                        }} />


                    {/* <canvas id="canvas"
                        style={{
                            // position: "absolute",
                            marginLeft: "auto",
                            marginRight: "auto",
                            left: 0,
                            right: 0,
                            textAlign: "center",
                            zindex: 9,
                            width: 400,
                            height: 400
                        }} /> */}
                         <Fab color="primary" aria-label="add-image" sx={{ position: "relative", bottom: 16, right: 16, overflow: "hidden" }} onClick={capture}>
                         <AddPhotoIcon />
                         </Fab>
                </Grid>
            </Grid>
        </Box>
    );

}