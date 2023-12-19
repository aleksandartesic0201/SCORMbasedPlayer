import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Alert, AlertTitle } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Item from "@mui/material/Grid";
import Link from "@mui/material/Link";
import UploadIcon from "@mui/icons-material/Upload";
import LoginImage from "../../../assets/images/login.svg";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import "./Upload.scss";
const Upload = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [courseFile, setCourseFile] = React.useState();
  const [success, setSuccess] = React.useState();

  const [courseFileError, setCourseFileError] = React.useState();
  const [postError, setPostError] = React.useState();

  const navigate = useNavigate();
  const formData = new FormData();

  const handleFileUpload = (event) => {
    // get the selected file from the input
    const file = event.target.files[0];
    // create a new FormData object and append the file to it    
    formData.append("file", file);
    setCourseFile(formData);    
  };

  const handleUploadSubmit = () => {
    setIsSubmitting(true);
    clearPreviousErrors();

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    setSuccess(true);
    // make a POST request to the File Upload API with the FormData object and Rapid API headers

    axios.post("/course/upload", courseFile, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // FIXME: This logic should be improved
  const validateForm = () => {
    let isValid = true;
    if (!courseFile) {
      setCourseFileError("File is required");
      isValid = false;
    }
    return isValid;
  };

  const clearPreviousErrors = () => {
    setCourseFileError();
    setPostError();
  };

  return (
    <Container maxWidth="lg" className="Import">
      <h1>
        <AutoAwesomeIcon className="Import__stars" /> SCORM Course Player
      </h1>
      <Grid container spacing={4}>        
        <Grid item lg={12} xs={12}>
          <Item sx={{ pt: 3 }}>
            <h2>
              Welcome! <AutoAwesomeIcon className="Import__stars" /> the SCORM 1.2 package
            </h2>
            {success ? <p>Imported successfully!</p> : <p>There are some problems while uploading the package.</p>}
            
            <Grid container spacing={2}>              
              <Grid item xs={12}>
                <Item>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    type="file"
                    onChange={handleFileUpload}
                    error={courseFileError !== undefined}
                    helperText={courseFileError}
                    required
                    fullWidth
                  />
                  {postError && (
                    <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
                      <AlertTitle>Sorry, something went wrong</AlertTitle>
                      {postError}
                    </Alert>
                  )}
                  <Stack
                    direction="row"
                    spacing={2}
                    className="Import__button-group"
                  >
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<UploadIcon />}
                      onClick={handleUploadSubmit}
                      disabled={isSubmitting}
                    >
                      Import
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      endIcon={<HowToRegIcon />}
                      color="secondary"
                      component={Link}
                      onClick={() => navigate("/dashboard")}
                    >
                      Home
                    </Button>
                  </Stack>
                </Item>
              </Grid>
            </Grid>
          </Item>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Upload;
