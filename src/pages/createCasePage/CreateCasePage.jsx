import { Grid, TextField, Select, MenuItem, Button } from "@mui/material";
import { useRef } from "react";
import { useState } from "react";
import ImageHolder from "../../components/imageHolder/ImageHolder.jsx";
import { createForm, make_request } from "../../helpers.js";
import "./CreateCasePage.scss";
import axios from "axios";
import { HeaderBar } from "../../components/headerBar/HeaderBar.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../pageWrapper/PageWrapper.jsx";

const titleStyle = {
    margin: 0,
    fontSize: "1em",
}

const fieldStyle = {
    width: '60%',
}

export function CreateCasePage(props) {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [gender, setGender] = useState("M");
    const [side, setSide] = useState("L");
    const [surgicalApproach, setSurgicalApproach] = useState(null);
    const [dateOfSurg, setDateOfSurg] = useState(null);
    const [surgeon, setSurgeon] = useState(null);
    const [surgicalPosition, setSurgicalPosition] = useState("S");

    // dynamic values loaded from backend
    const [surgeons, setSurgeons] = useState([]);
    const [allAppraoches, setAllAppraoches] = useState([]);

    // images related
    const img1Ref = useRef(null);
    const img2Ref = useRef(null);
    const img3Ref = useRef(null);
    const [img1, setImg1] = useState(null);
    const [img2, setImg2] = useState(null);
    const [img3, setImg3] = useState(null);

    const nav = useNavigate();

    useEffect(() => {
        getSurgeons();
        getSurgicalApproaches();
    }, []);

    const submitCase = async () => {
        const payload = {
            firstname: firstname,
            lastname: lastname,
            dateOfBirth: dateOfBirth,
            gender: gender,
            sideOfAnalysis: side,
            surgicalApproach: surgicalApproach,
            surgicalPosition: surgicalPosition,
            dateOfSurgery: dateOfSurg,
            surgeon: surgeon,
            xrayAp: img1,
            xrayLst: img2,
            xrayLse: img3,
        }


        const res = await createForm(payload);
        nav("/annotation-steps/" + res.id);
        console.log(res);
    }

    const getSurgeons = async () => {
        const res = await make_request("/api/user/surgeons/", "GET");
        console.log(res)
        const allSurgeons = res.results;
        setSurgeons(allSurgeons);
        if (allSurgeons.length > 0) {
            setSurgeon(allSurgeons[0].id)
        } else {
            alert("No surgeons available");
        }
    }

    const getSurgicalApproaches = async () => {
        const res = await make_request("/api/surgicalapproach/", "GET");
        const approaches = res.results;
        setAllAppraoches(approaches);
        setSurgicalApproach(approaches[0].name);
    }

    const disableBtn = () => {
        return (
            firstname === "" || lastname === ""
            || dateOfBirth === null || dateOfBirth === ""
            || dateOfSurg === null || dateOfSurg === ""
            || img1 === null || img2 === null || img3 === null
        )
    }

    return <PageWrapper>
        <div className="case-page" id="create-case-page">
            <div id="create-case-card">
                <h2 style={{ margin: 0 }}>New Case</h2>
                <hr style={{ height: '1px', border: 'none', backgroundColor: 'grey', width: '100%', margin: 0 }} />
                <input ref={img1Ref} style={{ display: "none" }} type="file" onChange={(e) => setImg1(e.target.files[0])} />
                <input ref={img2Ref} style={{ display: "none" }} type="file" onChange={(e) => setImg2(e.target.files[0])} />
                <input ref={img3Ref} style={{ display: "none" }} type="file" onChange={(e) => setImg3(e.target.files[0])} />
                <form id="new-case-form">
                    <div className="half-col">
                        <div className="row">
                            <h2 style={titleStyle}>First Name</h2>
                            <TextField sx={fieldStyle} size="small" onChange={(e) => setFirstname(e.target.value)} />
                        </div>
                        <div className="row">
                            <h2 style={titleStyle}>Date of Birth</h2>
                            <TextField sx={fieldStyle} type="date" size="small" onChange={(e) => setDateOfBirth(e.target.value)} />
                        </div>
                        <div className="row">
                            <h2 style={titleStyle}>Side of Analysis</h2>
                            <Select
                                sx={fieldStyle}
                                value={side}
                                onChange={(e) => setSide(e.target.value)}
                                size="small"
                            >
                                <MenuItem value="L">Left</MenuItem>
                                <MenuItem value="R">Right</MenuItem>
                            </Select>
                        </div>
                        <div className="row">
                            <h2 style={titleStyle}>Date of Surgery</h2>
                            <TextField sx={fieldStyle} type="date" size="small" onChange={(e) => setDateOfSurg(e.target.value)} />
                        </div>
                        <div id="img-row">
                            <ImageHolder image={img1} onClick={() => img1Ref.current.click()} />
                            <ImageHolder image={img2} onClick={() => img2Ref.current.click()} />
                            <ImageHolder image={img3} onClick={() => img3Ref.current.click()} />
                        </div>
                    </div>
                    <div className="half-col">
                        <div className="row">

                            <h2 style={titleStyle}>Last Name</h2>
                            <TextField sx={fieldStyle} size="small" onChange={(e) => setLastname(e.target.value)} />
                        </div>
                        <div className="row">
                            <h2 style={titleStyle}>Gender</h2>
                            <Select
                                sx={fieldStyle}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                size="small"
                            >
                                <MenuItem value="M">Male</MenuItem>
                                <MenuItem value="F">Female</MenuItem>
                                <MenuItem value="N">Neutral</MenuItem>
                            </Select>
                        </div>
                        <div className="row">
                            <h2 style={titleStyle}>Surgical Approach</h2>
                            <Select
                                sx={fieldStyle}
                                value={surgicalApproach}
                                onChange={(e) => setSurgicalApproach(e.target.value)}
                                size="small"
                            >
                                {allAppraoches.map((approach) => <MenuItem key={approach.name} value={approach.name}>{approach.name}</MenuItem>)}
                            </Select>
                        </div>
                        <div className="row">
                            <h2 style={titleStyle}>Surgeon</h2>
                            {surgeon && <Select
                                sx={fieldStyle}
                                value={surgeon}
                                onChange={(e) => setSurgeon(e.target.value)}
                                size="small"
                            >
                                {surgeons.map(s => <MenuItem key={s.id} value={s.id}>{s.full_name}</MenuItem>)}
                            </Select>}
                        </div>
                        <div className="row">
                            <h2 style={titleStyle}>Surgical Position</h2>
                            <Select
                                sx={fieldStyle}
                                value={surgicalPosition}
                                onChange={(e) => setSurgicalPosition(e.target.value)}
                                size="small"
                            >
                                <MenuItem value="S">S</MenuItem>
                                <MenuItem value="D">D</MenuItem>
                            </Select>
                        </div>
                        <div id="bottom-btn">
                            <Button fullWidth variant="contained" disabled={disableBtn()} onClick={submitCase}>Continue</Button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    </PageWrapper>

}