import {createSlice} from '@reduxjs/toolkit';
import {homeApi} from "../api";

export const initialState ={
    search:[],
    majorDasha:[],
    subDasha:[],
    subDasha2:[],
    subDasha3:[],
    subDasha4:[],
    status:""
}

export const homeSlice = createSlice({
    name:"Home",
    initialState,
    reducers:{
         searchRequest:(state) =>{
            state.status="Request"
         },
         searchSuccess:(state,{payload}) =>{
             state.search=payload
             state.search.status="Success_Search"
         },
         searchFailure:(state,{payload}) =>{
              state.search=payload
              state.search.status="Failure_Search"
         },
         majorDashaRequest:(state) =>{
             state.status="Major_Dasha_Request"
         },
        majorDashaSuccess:(state,{payload})=>{
            state.majorDasha=payload
            state.majorDasha.status="Major_Dasha_Success"
        },
        majorDashaFailure:(state,{payload})=>{
            state.majorDasha=payload
            state.majorDasha.status="Major_Dasha_Failure"
        },
        subDashaRequest:(state) =>{
            state.status="SubDasha_Request"
        },
        subDashaSuccess:(state,{payload}) =>{
            state.subDasha=payload
            state.subDasha.status="SubDasha_Success"
        },
        subDashaFailure:(state,{payload}) =>{
            state.subDasha=payload
            state.subDasha.status="SubDasha_Failure"
        },
        subDasha2Request:(state) =>{
            state.status="SubDasha2_Request"
        },
        subDasha2Success:(state,{payload}) =>{
            state.subDasha2=payload
            state.subDasha2.status="SubDasha2_Success"
        },
        subDasha2Failure:(state,{payload}) =>{
            state.subDasha2=payload
            state.subDasha2.status="SubDasha2_Failure"
        },
        subDasha3Request:(state) =>{
            state.status="SubDasha3_Request"
        },
        subDasha3Success:(state,{payload}) =>{
            state.subDasha3=payload
            state.subDasha3.status="SubDasha3_Success"
        },
        subDasha3Failure:(state,{payload}) =>{
            state.subDasha3=payload
            state.subDasha3.status="SubDasha3_Failure"
        },
        subDasha4Request:(state) =>{
            state.status="SubDasha4_Request"
        },
        subDasha4Success:(state,{payload}) =>{
            state.subDasha4=payload
            state.subDasha4.status="SubDasha4_Success"
        },
        subDasha4Failure:(state,{payload}) =>{
            state.subDasha4=payload
            state.subDasha4.status="SubDasha4_Failure"
        },
        

         
    }
})

export const {
    searchRequest,searchSuccess,searchFailure,majorDashaRequest,
    majorDashaSuccess,majorDashaFailure,subDashaRequest,subDashaSuccess,
    subDashaFailure,subDasha2Request,subDasha2Success,subDasha2Failure,
    subDasha3Request,subDasha3Success,subDasha3Failure,subDasha4Request,
    subDasha4Success,subDasha4Failure }=homeSlice.actions

const home=homeSlice.reducer;
export default home;

export function search(payload){
    return dispatch =>{
        dispatch(searchRequest());
        homeApi.search(payload).then(
            data =>{dispatch(searchSuccess(data))},
            error =>{dispatch(searchFailure(error))}
        )
    }
}

export function majorDasha(payload){
    return dispatch => {
        dispatch(majorDashaRequest());
        homeApi.majorDasha(payload).then(
            data =>{dispatch(majorDashaSuccess(data))},
            error => {dispatch(majorDashaFailure(error))}
        )
    }
}

export function subDasha(payload,query){
    return dispatch => {
        dispatch(subDashaRequest());
        homeApi.subDasha(payload,query).then(
            data => {dispatch(subDashaSuccess(data))},
            error => {dispatch(subDashaFailure(error))}
        )
    }
}

export function subDasha2(payload,query,query2){
    return dispatch => {
        dispatch(subDasha2Request());
        homeApi.subDasha2(payload,query,query2).then(
            data => {dispatch(subDasha2Success(data))},
            error => {dispatch(subDasha2Failure(error))}
        )
    }
}

export function subDasha3(payload,query,query2,query3){
    return dispatch => {
        dispatch(subDasha3Request());
        homeApi.subDasha3(payload,query,query2,query3).then(
            data => {dispatch(subDasha3Success(data))},
            error => {dispatch(subDasha3Failure(error))}
        )
    }
}

export function subDasha4(payload,query,query2,query3,query4){
    return dispatch => {
        dispatch(subDasha4Request());
        homeApi.subDasha4(payload,query,query2,query3,query4).then(
            data => {dispatch(subDasha4Success(data))},
            error => {dispatch(subDasha4Failure(error))}
        )
    }
}