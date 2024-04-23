import logo from "./logo.svg";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import React, { Fragment } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  FormControl,
  InputBase,
  Button,
  Divider,
  CardMedia,
  CircularProgress,
} from "@mui/material";
// import SendOutlined from '@mui/icons-material/SendOutlined';

const colors = {
  primary: "#368738",
  secondary: "#1E1E1E",
  white: "#ffffff",
};

const Image = {
  bgImage: require("../src/travel.jpg"),
};

const backgroundImageStyle = {
  backgroundImage: `url(${Image.bgImage})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  minHeight: "100vh",
};

const loaderTexts = ["sending", "processing", "generating", "loading"];

function App() {
  const [userInput, setUserInput] = useState("");
  const [botResponse, setBotResponse] = useState("");
  console.log("🚀 ~ App ~ botResponse:", botResponse)
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [loaderTextIndex, setLoaderTextIndex] = useState(0);

  useEffect(() => {
    let intervalId;

    const rotateLoaderText = () => {
      intervalId = setInterval(() => {
        setLoaderTextIndex((prevIndex) =>
          (prevIndex + 1) % loaderTexts.length
        );
      }, 40000); 
    };

    rotateLoaderText();

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const response = await fetch('http://127.0.0.1:8000/chatapp/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //     // 'X-CSRFToken': getCsrfToken(),  // Replace with your logic to obtain CSRF token
      //   },
      //   body: new URLSearchParams({
      //     'user_input': userInput,
      //   }),
      // });
      setLoader(true);
      const encodedUserInput = encodeURIComponent(userInput);

      // Construct the URL with the encoded user input
      const url = `http://localhost:8000/ask?question=${encodedUserInput}`;

      // Make the GET request
      const response = await fetch(url, {
        method: "GET",
        // headers: {
        //   "Content-Type": "plain/text",
        // }
      });
      setUserMessage(userInput);
      const data = await response.json();
      const trimmedAnswer = data?.answer?.trim().split(":")[1]?.trim(); 
      setBotResponse(trimmedAnswer);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), content: userInput, sender: "user" },
        { id: Date.now() + 1, content: trimmedAnswer, sender: "bot" },
      ]);
    } catch (error) {
      setUserMessage(userInput);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), content: userInput, sender: "user" },
        { id: Date.now() + 1, content: error.message, sender: "bot" },
      ]);
      console.error("Error:", error);
    } finally {
      setUserInput("");
      setLoader(false);
    }
  };

  // Scroll to the bottom when the component updates
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]); // Assuming you have a messages state

  return (
    <Box style={backgroundImageStyle}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pt: 20,
        }}
      >
        <Card sx={{ width: "700px" }}>
          <Box sx={{ width: "100%" }}>
            {/* ChatHeader */}
            <Box display="flex" justifyContent="space-between" width="100%">
              <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
                <Avatar
                  // alt="Remy Sharp"
                  // src={Images.avatar2}
                  sx={{ width: 28, height: 28 }}
                />
                <Box sx={{ pl: 1 }}>
                  <Typography sx={{ fontWeight: "bold" }}>user_name</Typography>
                </Box>
              </Box>
              <Box>
                {/* <IconButton><PhoneOutlined /></IconButton>
          <IconButton><VideocamOutlined /></IconButton>
          <IconButton><MoreVertOutlined /></IconButton> */}
              </Box>
            </Box>
            <Divider />
          </Box>

          <Box
            ref={chatContainerRef}
            sx={{
              minHeight: "120px",
              maxHeight: "400px",
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "5px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#eee",
                borderRadius: "5px",
              },
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Fragment>
                  <Card
                    sx={{
                      p: 1,
                      borderRadius: "8px",
                      minWidth: "310px",
                      maxWidth: "320px",
                      backgroundColor:
                        message.sender === "user"
                          ? colors.secondary
                          : colors.white,
                      color:
                        message.sender === "user"
                          ? colors.white
                          : colors.secondary,
                    }}
                  >
                    <Typography>{message.content}</Typography>
                  </Card>
                </Fragment>
              </Box>
            ))}
            {loader && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px", // Add some spacing above the loader
                  opacity: loader ? 1 : 0, // Control opacity for smooth transition
                  transition: "opacity 0.3s ease-in-out", // Add transition animation
                }}
              >
                <CardMedia sx={{ width: 50, height: "auto", m: "auto" }}>
                  <CircularProgress color="primary" />
                  <Typography variant="body2" color="textSecondary">
                  {loaderTexts[loaderTextIndex]}
                  </Typography>
                </CardMedia>
              </Box>
            )}
          </Box>

          <form onSubmit={handleSubmit}>
            <Divider />
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: colors.white,
              }}
            >
              <Box sx={{ width: "100%", height: "50px" }}>
                <FormControl sx={{ width: "100%" }}>
                  <InputBase
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter Your Message"
                    multiline
                    maxRows={2}
                    sx={{
                      width: "100%",
                      height: "50px",
                      borderRadius: "8px",
                      "& .MuiInputBase-input": { p: 1 },
                    }}
                  />
                </FormControl>
              </Box>
              <Box>
                <Button
                  type="submit"
                  // onClick={() => { send(message); setMessage("") }} startIcon={<SendOutlined />}
                  variant="contained"
                  disabled={loader ? true : false}
                  sx={{
                    mx: 1,
                    width: "80px",
                    height: "28px",
                    fontSize: 12,
                    borderRadius: "10px",
                    textTransform: "capitalize",
                    backgroundColor: colors.secondary,
                    color: colors.white,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: colors.gray,
                    },
                  }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </form>
        </Card>
      </Box>
    </Box>
  );
}

export default App;
