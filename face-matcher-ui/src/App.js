import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import * as tf from "@tensorflow/tfjs";
import { drawMesh } from "./meshUtilities.js";
import Button from '@mui/material/Button';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Appbar from './component/Appbar/Appbar';
import Home from './component/home/Home';



function App() {
 
  





  

  return (
    <div className="App">
      <Appbar />
      <Home />
     


        {/* <Button variant="contained" onClick={capture}startIcon={<CameraAltIcon />}>Capture</Button> */}
    </div>
  );
}

export default App;