import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Box, Fab, Stack, TextField } from "@mui/material";
import styled from "styled-components";
import LoginIcon from "@mui/icons-material/Login";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
  },
}));

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const classes = useStyles();
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const { setAuthMember } = useGlobals();

  const handleUserName = (e: T) => {
    console.log(e.target.value);
    setMemberNick(e.target.value);
  };

  const handlePhone = (e: T) => {
    console.log(e.target.value);
    setMemberPhone(e.target.value);
  };

  const handlePassword = (e: T) => {
    console.log(e.target.value);
    setMemberPassword(e.target.value);
  };

  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter" && signupOpen) {
      handleSignupRequest().then();
    } else if (e.key === "Enter" && loginOpen) {
      handleLoginRequest().then();
    }
  };

  const handleSignupRequest = async () => {
    try {
      const isFulfill =
        memberNick !== "" && memberPhone !== "" && memberPassword !== "";
      if (!isFulfill) throw new Error(Messages.error3);

      const signupInput: MemberInput = {
        memberNick: memberNick,
        memberPhone: memberPhone,
        memberPassword: memberPassword,
      };
      const member = new MemberService();
      const result = await member.signup(signupInput);
      setAuthMember(result);
      handleSignupClose();
    } catch (err) {
      console.log(err);
      handleSignupClose();
      sweetErrorHandling(err).then();
    }
  };

  const handleLoginRequest = async () => {
    try {
      const isFullfill = memberNick !== "" && memberPassword !== "";
      if (!isFullfill) throw new Error(Messages.error3);
      const loginInput: LoginInput = {
        memberNick: memberNick,
        memberPassword: memberPassword,
      };
      const member = new MemberService();
      const result = await member.login(loginInput);
      setAuthMember(result);
      handleLoginClose();
    } catch (err) {
      console.log(err);
      handleLoginClose();
      sweetErrorHandling(err).then();
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={signupOpen}
        onClose={handleSignupClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={signupOpen}>
          <Stack
            className={classes.paper}
            direction={"row"}
            sx={{ width: "800px" }}
          >
            <Box
              sx={{
                width: "62%",
                height: "100%",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #4d664bff, #148b12ff)",
                marginTop: "9px",
                marginLeft: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box sx={{ position: "relative", width: 300, height: 300 }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "20%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    animation: "float 3s ease-in-out infinite",
                    fontSize: "80px",
                    color: "white",
                    "@keyframes float": {
                      "0%, 100%": {
                        transform: "translateX(-50%) translateY(0px)",
                      },
                      "50%": {
                        transform: "translateX(-50%) translateY(-15px)",
                      },
                    },
                  }}
                >
                  👤
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    top: "60%",
                    left: "30%",
                    animation: "pulse 2s ease-in-out infinite",
                    fontSize: "60px",
                    color: "white",
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 1 },
                      "50%": { opacity: 0.6 },
                    },
                  }}
                >
                  🔒
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    top: "60%",
                    left: "70%",
                    animation: "rotate 4s linear infinite",
                    fontSize: "60px",
                    color: "white",
                    "@keyframes rotate": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                >
                  🔑
                </Box>
              </Box>
            </Box>

            <Stack sx={{ marginLeft: "69px", alignItems: "center" }}>
              <h2>Signup Form</h2>
              <TextField
                sx={{ marginTop: "7px" }}
                id="outlined-basic"
                label="username"
                variant="outlined"
                onChange={handleUserName}
              />
              <TextField
                sx={{ my: "17px" }}
                id="outlined-basic"
                label="phone number"
                variant="outlined"
                onChange={handlePhone}
              />
              <TextField
                id="outlined-basic"
                label="password"
                variant="outlined"
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
              />
              <Fab
                sx={{ marginTop: "30px", width: "120px" }}
                variant="extended"
                color="primary"
                onClick={handleSignupRequest}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Signup
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={loginOpen}
        onClose={handleLoginClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={loginOpen}>
          <Stack
            className={classes.paper}
            direction={"row"}
            sx={{ width: "700px" }}
          >
            <Box
              sx={{
                width: "62%",
                height: "100%",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #4d664bff, #148b12ff)",
                marginTop: "9px",
                marginLeft: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box sx={{ position: "relative", width: 300, height: 300 }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 150,
                    height: 150,
                    border: "4px solid white",
                    borderRadius: "50%",
                    animation: "pulseRing 2s ease-out infinite",
                    "@keyframes pulseRing": {
                      "0%": {
                        transform: "translate(-50%, -50%) scale(0.8)",
                        opacity: 1,
                      },
                      "100%": {
                        transform: "translate(-50%, -50%) scale(1.8)",
                        opacity: 0,
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "80px",
                    animation: "bounce 2s ease-in-out infinite",
                    color: "white",
                    "@keyframes bounce": {
                      "0%, 100%": {
                        transform: "translate(-50%, -50%) scale(1)",
                      },
                      "50%": { transform: "translate(-50%, -50%) scale(1.15)" },
                    },
                  }}
                >
                  🔐
                </Box>
              </Box>
            </Box>

            <Stack
              sx={{
                marginLeft: "65px",
                marginTop: "25px",
                alignItems: "center",
              }}
            >
              <h2>Login Form</h2>
              <TextField
                id="outlined-basic"
                label="username"
                variant="outlined"
                sx={{ my: "10px" }}
                onChange={handleUserName}
              />
              <TextField
                id={"outlined-basic"}
                label={"password"}
                variant={"outlined"}
                type={"password"}
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
              />
              <Fab
                sx={{ marginTop: "27px", width: "120px" }}
                variant={"extended"}
                color={"primary"}
                onClick={handleLoginRequest}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Login
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>
    </div>
  );
}
