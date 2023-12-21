import React , { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

import Input from '@mui/material/Input';
import Item from "@mui/material/Grid";
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Stack from "@mui/material/Stack";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import UploadIcon from "@mui/icons-material/Upload";

import "./Dashboard.scss";

const Dashboard = () => {

  const [dest, setDest] = useState("uploads/");
  const [scorm, setScorm] = useState(0);
  const [sco, setSco] = useState(0);
  const [user, setUser] = useState(1);
  const [launchFile, setLaunchFile] = useState();
  const [title, setTitle] = useState();
  const [status, setStatus] = useState("Unknown");
  const [score, setScore] = useState("0.0");
  const [time, setTime] = useState("00:00:00");
  const [courses, setCourses] = useState([]);
  const [API, setAPI] = useState();
  
  const [scoesTrack, setScoesTrack] = useState([]);
  const [openCourse, setOpenCourse] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleStatusClose = () => setOpenStatus(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/course/list", {
      method: "GET"     
    })
    .then((response) => response.json())
    .then((data) => {
      setCourses(data);      
    })
    .catch((error) => console.log(error));
  }, [null]);

  const handleOpen = (scorm, title) => {
    
    fetch("/course/getsco?id=" + scorm, {
      method: "GET"     
    })
    .then((response) => response.json())
    .then((result) => {      
      console.log(result);
      setSco(result.sco);
      setLaunchFile(result.launch);
      var userid = user;
      window.initializeAPI(scorm, result.sco, userid);
    })
    .catch((error) => console.log(error));
    
    setScorm(scorm);
    setTitle(title);
    setOpen(true);    
  };

  const handleStatus = (scorm, title) => {
    
    fetch("/course/getstatus?id=" + scorm + "&user=" + user, {
      method: "GET"     
    })
    .then((response) => response.json())
    .then((result) => {      
      
      setStatus(result.status);
      setScore(result.score);
      setTime(result.time);
    })
    .catch((error) => console.log(error));
    setTitle(title);
    setOpenStatus(true);
  };

  const handleDelete = (scorm) => {
    
    fetch("/course/delcourse?id=" + scorm, {
      method: "GET"     
    })
    .then((response) => response.json())
    .then((result) => { 
      navigate("/list")
    })
    .catch((error) => console.log(error));  
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
    
    var windowobj = window.open(dest + launchFile, "Player", options);

    setTimeout(function timeout() {
        if (windowobj.closed) {          
          //window.parent.location.href = "";
        } else {
          //setTimeout(timeout, 800);
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
      <Button
        variant="outlined"
        size="large"
        endIcon={<UploadIcon />}
        color="secondary"
        component={Link}
        onClick={() => navigate("/upload")}
      >
                      Upload
      </Button>  
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
                <Stack
                  direction="row"
                  spacing={2}
                  className="Dashboard__button-group"
                >                              
                <Button
                      variant="outlined"
                      size="large"                     
                      component={Link}                      
                      onClick={(e)=>handleOpen(course.id, course.title)}
                    >
                      Launch
                </Button>
                <Button
                      variant="outlined"
                      size="large"                     
                      color="secondary"
                      component={Link}                      
                      onClick={(e)=>handleStatus(course.id, course.title)}
                    >
                      Status
                </Button>                  
                <Button
                      variant="outlined"
                      size="large"                     
                      color="secondary"
                      component={Link}                      
                      onClick={(e)=>handleDelete(course.id)}
                    >
                      Delete
                </Button>  
                </Stack>              
                </TableCell>
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

        <Modal
          open={openStatus}
          onClose={handleStatusClose}    
  
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
              <Typography id="PleaseClick" variant="h6" component="h2">
              {title}
              </Typography>
              <TableContainer component={Paper}>
                <Table  aria-label="simple table">

                  <TableBody>
                      <TableRow>
                          <TableCell sx={{ border:1 }}>Complete Status</TableCell >
                          <TableCell sx={{ border:1 }}>{status}</TableCell >                          
                      </TableRow>
                      <TableRow>
                          <TableCell sx={{ border:1 }}>Score</TableCell >
                          <TableCell sx={{ border:1 }}>{score}</TableCell >                          
                      </TableRow>
                      <TableRow>
                          <TableCell sx={{ border:1 }}>Total Time</TableCell >
                          <TableCell sx={{ border:1 }}>{time}</TableCell >                          
                      </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box> 
        </Modal> 
    </Container>
  );
};

export default Dashboard;
