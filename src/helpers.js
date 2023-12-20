import axios from "axios";

const backendURL = "http://52.62.221.135:80";

export async function fetchAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");

    // user must login if refresh token not found
    if (!refreshToken) {
        return Promise.reject("refresh token not found");
    }

    const payload = {
        method: "POST",
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ 'refresh': refreshToken })
    }
    const response = await fetch(backendURL + "/api/token/refresh/", payload);

    if (response.status === 200) {
        const data = await response.json();
        return Promise.resolve(data.access);
    } else {
        return Promise.reject("refresh token expired");
    }
}

export async function createForm(payload) {
    const accessToken = localStorage.getItem("accessToken");
    let form_data = new FormData();
    form_data.append("patient.first_name", payload.firstname);
    form_data.append("patient.last_name", payload.lastname);
    form_data.append("patient.date_of_birth", payload.dateOfBirth);
    form_data.append("patient.gender", payload.gender);

    form_data.append("side_of_analysis", payload.sideOfAnalysis);
    form_data.append("surgical_position", payload.surgicalPosition);
    form_data.append("surgical_approach", payload.surgicalApproach);
    form_data.append("date_of_surgery", payload.dateOfSurgery);
    form_data.append("surgeon", payload.surgeon);

    form_data.append("imagingdata.xray_ap", payload.xrayAp);
    form_data.append("imagingdata.xray_lst", payload.xrayLst);
    form_data.append("imagingdata.xray_lse", payload.xrayLse);
    const res = await axios({
        method: 'POST',
        url: backendURL + '/api/case/create',
        data: form_data,
        headers: {
            "content-type": "multipart/form-data",
            'Authorization': "Bearer " + accessToken
        }
    });

    if (res.status === 201 || res.status === 200) {
        return res.data;
    } else {
        alert("Unable to create new case")
    }
}

export async function fetchImage(url) {
    const payload = {
        method: 'GET',
    }

    const res = await fetch(url, payload);
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    return imageObjectURL;
}


export function getImageOriginalDimensions(imgSrc) {
    var img = new Image();
    img.src = imgSrc;
    return new Promise((resolve, reject) => {
        img.onload = () => resolve([img.width, img.height]);
    })
}


export async function make_request(route, method, body = null) {
    const response = await requestWithAccessToken(route, method, body);


    if (response.status === 200) {
        return response.json();
    } else {
        // try fetching new access token
        try {
            console.log('fetching again')
            const accessToken = await fetchAccessToken();
            console.log(response)

            localStorage.setItem("accessToken", accessToken);
            const secResponse = await requestWithAccessToken(route, method, body);
            if (secResponse.status === 200) {
                return secResponse.json();
            } else {
                const err = await secResponse.json();
                console.log(err)
                return Promise.reject(err.detail);
            }
        } catch (error) {
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            return Promise.reject("Login has expired");
        }
    }
}

export function getMovements(event, canvas, scaleFactor) {
    const rect = canvas.getBoundingClientRect();
    const xDistance = (event.clientX - rect.left) / scaleFactor;
    const yDistance = (event.clientY - rect.top) / scaleFactor;
    return [xDistance, yDistance];
}

async function requestWithAccessToken(route, method, body = null) {
    const accessToken = localStorage.getItem("accessToken");
    const payload = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + accessToken
        },
    }
    if (body !== null) { payload.body = JSON.stringify(body); }

    return fetch(backendURL + route, payload)
        .then((res) => {
            return res
        })

    // return fetch(backendURL + route, payload);
}