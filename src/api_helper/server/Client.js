import {Error} from "./Error"
export const Client = {
    ApiCall,
    post
}
let username = "614346";
let password = "f898131e8e2aaa42db98e503afd9b551"
let base64string = btoa(`${username}:${password}`);

function post(payload) {
    let request = {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Basic ${base64string}`,
            "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)
    }

    return request
}

function ApiCall(
    method,
    endpoint,
    payload = {}
) {
    let request = {};
    let url = `https://json.astrologyapi.com`;
    switch (method) {
        case "POST":
            request = post(payload);
            break;
        default:
            console.log("Requested Method Not Valid");
    }
    return fetch(`${url}${endpoint}`, request).then(response);
}

function response(res) {
    let json = res.json()
    if (!(res.status === 200 || res.status === 201)) {
        return json.then(
            re => {
                Error.show(re);
                return Promise.reject(re)
            });
    }
    return json;
}
