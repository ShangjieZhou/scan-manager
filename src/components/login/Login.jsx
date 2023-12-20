import { Button, TextField, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { fetchAccessToken, make_request } from "../../helpers.js";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const STEP = {
    USERNAME: 1,
    PASSWORD: 2,
}

const formStyle = {
    position: "absolute",
    right: "10%",
    maxWidth: "400px",
    minWidth: "200px",
    width: "20%",
}

const containerStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    rowGap: "20px",
}

const btnStyle = {
    '&:disabled': {
        backgroundColor: "grey",
        color: "rgb(0,0,0,0.6)",
    },
}

const headerStyle = {
    fontSize: "20px",
    margin: "0",
    color: "white"
}

export function Login(props) {
    const [username, setUsername] = useState(null);
    const [pwd, setPwd] = useState(null);
    const [step, setStep] = useState(STEP.USERNAME);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [btnText, setBtnText] = useState("Next");
    const navigator = useNavigate();

    const loginFromMemory = async () => {
        try {
            const accessToken = await fetchAccessToken();
            localStorage.setItem("accessToken", accessToken);
            navigator("/cases-list");
        } catch (error) {
            return;
        }
    }

    useEffect(() => {
        // auto login if possible
        loginFromMemory();
    }, []);

    const nextStep = (event) => {
        event.preventDefault();
        if (step === STEP.USERNAME) {
            setStep(STEP.PASSWORD);
            setBtnText("Log in")
        } else if (step === STEP.PASSWORD) {
            make_request("/api/token/", "POST", {
                email: username,
                password: pwd,
            }).then((res) => {
                localStorage.setItem("accessToken", res.access);
                localStorage.setItem("refreshToken", res.refresh);
                navigator("/cases-list")
            }).catch((err) => {
                toast.error(err)
            })
        }
    }

    const setBtn = (input) => {
        input.trim() === "" ? setBtnDisabled(true) : setBtnDisabled(false);
    }

    return (
        <form style={formStyle}>
            <Box sx={containerStyle}>
                <h1 style={headerStyle}>Login</h1>
                {step === STEP.USERNAME && <LoginInput
                    onChange={(e) => {
                        setBtn(e.target.value);
                        setUsername(e.target.value);
                    }}
                    hint="Username"
                    type="text"
                />}
                {step === STEP.PASSWORD && <LoginInput
                    onChange={(e) => {
                        setBtn(e.target.value);
                        setPwd(e.target.value);
                    }}
                    hint="Password"
                    type="password"
                />}
                <Button
                    type="submit"
                    sx={btnStyle}
                    disabled={btnDisabled}
                    size="medium"
                    onClick={nextStep}
                    variant="contained"
                >
                    {btnText}
                </Button>
            </Box>
        </form>
    )
}

function LoginInput(props) {
    return (
        <TextField
            type={props.type}
            sx={{
                '& .MuiInputBase-root': { backgroundColor: "white" },
            }}
            size="small"
            onChange={props.onChange}
            label={props.hint}
            variant="outlined"
        />
    )
}