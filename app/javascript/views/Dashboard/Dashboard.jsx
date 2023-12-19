import React , { useEffect, useState } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Table from '@mui/material/Table';
import Input from '@mui/material/Input';
import Item from "@mui/material/Grid";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import "./Dashboard.scss";

const Dashboard = () => {

  const [scorm, setScorm] = useState(0);
  const [title, setTitle] = useState();
  const [courses, setCourses] = useState([]);
  const [API, setAPI] = useState();
  
  const [scoesTrack, setScoesTrack] = useState([]);
  const [openCourse, setOpenCourse] = useState(false);
  const [open, setOpen] = React.useState(false);
  //const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpen = (scorm, title) => {
    
    window.initializeAPI(scorm);
    setScorm(scorm);
    setTitle(title);

    setOpen(true);

    
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 5,
  };

  useEffect(() => {
    fetch("/course/list", {
      method: "GET"     
    })
    .then((response) => response.json())
    .then((data) => {
      setCourses(data);      
    })
    .catch((error) => console.log(error));

    // fetch("/course/getScoes?id=7", {
    //   method: "GET"     
    // })
    // .then((response) => response.json())
    // .then((result) => {
      
    //   let trackObj = JSON.parse(result.data);
    //   setScoesTrack(trackObj);
    //   if (trackObj.version == "scorm12") {
    //     //setAPI(new SCORMapi1_2(trackObj, "setTrack"));
    //   }
    // })
    // .catch((error) => console.log(error));

  }, [null]);

  const PleaseClickStyle = {
    display: 'block',
  };
  const OtherStyle = {
    display: 'none',
  };
  const PopupBlockedStyle = {
    display: 'block',
    visibility: 'visible',
  };

  const launchCourse = (width, height) => {
    document.getElementById("PleaseClick").style.display = 'none';
    document.getElementById("PopupBlocked").style.display = 'none';
    document.getElementById("PossiblePopupBlockerMessage").style.display = 'block';

    width = Math.round(screen.availWidth)
    height = Math.round(screen.availHeight);
    
    var options = ",width=" + width + ",height=" + height;

    var windowobj = window.open("uploads/4103887a0513c3c44cc679215bc435d7/index_lms.html", "Player", options);

    setTimeout(function timeout() {
        if (windowobj.closed) {          
          window.parent.location.href = "";
        } else {
          setTimeout(timeout, 800);
        }
    }, 1000);

    windowobj.focus();
    return windowobj;
  };
  return (
    <Container maxWidth="lg" className="Register">
      <h1>
        <AutoAwesomeIcon className="Login__stars" /> SCORM Course Player
      </h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
              <TableRow>
                  <TableCell >Title</TableCell >
                  <TableCell >Version</TableCell >
                  <TableCell >Action</TableCell >
              </TableRow>
          </TableHead>
          <TableBody>
            {courses && courses.map((course, i) => (
              <TableRow key={i}>
                <TableCell>{course.title}</TableCell >
                <TableCell>{course.version}</TableCell >
                <TableCell>                
                <Button
                      variant="outlined"
                      size="large"                     
                      color="secondary"
                      component={Link}                      
                      onClick={(e)=>handleOpen(course.id, course.title)}
                    >
                      Launch
                </Button>
                </TableCell >
              </TableRow>                
              ))}             
          </TableBody>
        </Table>
        </TableContainer>

        <Modal
          open={open}  
  
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
              <Typography id="PleaseClick" variant="h6" component="h2">
              Click here to launch the lesson.
              </Typography>
              <Box id="MessageAreaWrapper">                  
                <Box id="PopupBlocked" style={PopupBlockedStyle}>
                    <Typography id="PleaseClick" variant="h6" component="h2">Popup Blocked</Typography>
                    <Typography id="PopupBlockedMessage">We attempted to launch your course in a new window, but a popup blocker is preventing it from opening. Please disable popup blockers for this site.</Typography>
                    <Button type="button" className='btn btn-primary btn-xl' id="LaunchScoButton" onClick={()=>launchCourse('', '')}>Launch Course</Button>
                </Box>  
                <Box id="Message" style={OtherStyle}>
                  <Typography id="CourseLaunchedMessage" variant="h6" component="h3">Your course has been launched in a new window.</Typography>
                </Box>
                <Box id="PossiblePopupBlockerMessage" style={OtherStyle}>We launched your course in a new window but if you do not see it, a popup blocker may be preventing it from opening. Please disable popup blockers for this site.</Box>
              </Box> 
            </Box> 
        </Modal>  

    </Container>
  );
};

export default Dashboard;
