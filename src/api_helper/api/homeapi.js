import {Client} from "../server";

export const  homeApi ={
    search,
    majorDasha,
    subDasha,
    subDasha2,
    subDasha3,
    subDasha4
}

function search(payload){
    return Client.ApiCall("POST",`/v1/kp_horoscope`,payload)
}

function majorDasha(payload){
    return Client.ApiCall("POST",`/v1/major_vdasha`,payload)
}

function subDasha(payload,query){
    return Client.ApiCall("POST",`/v1/sub_vdasha/${query}`,payload)
}

function subDasha2(payload,query){
    return Client.ApiCall("POST",`/v1/sub_sub_vdasha/${query}`,payload)
}

function subDasha3(payload,query){
    return Client.ApiCall("POST",`/v1/sub_sub_sub_vdasha/${query}`,payload)
}

function subDasha4(payload,query){
    return Client.ApiCall("POST",`/v1/sub_sub_sub_sub_vdasha/${query}`,payload)
}

