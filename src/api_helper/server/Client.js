import {Error} from "./Error"
import { db } from '../../firebase/firebaseConfig'
export const Client = {
    ApiCall,
    post,
    firebaseApiCall,

}
let username = "615494";
let password = "eab7d2c05cd95ed31e6d8e646dd0fbe6"
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

function firebaseApiCall(method, payload){
    switch(method) {
        case 'POST':
            return db.collection('customer').add(payload.data)
            .then((docRef) => {
                const chartData = { ...payload.chartDetails, customerId: docRef.id }
                db.collection('customerCharts').add(chartData)
                    .then(() => console.log("Chart data Added!!"))
                    .catch((error) => console.log("Error in", error))
            })

        case 'GET':
            return db.collection('customer').onSnapshot((snapshot) => snapshot.docs.forEach(item => console.log(item.data()))) 
        default :
            console.log("Invalid Method!")
    }
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
