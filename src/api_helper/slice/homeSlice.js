import { createSlice } from '@reduxjs/toolkit';
import { homeApi } from "../api";

export const initialState = {
    search: [],
    majorDasha: [],
    subDasha: [],
    subDasha2: [],
    subDasha3: [],
    subDasha4: [],
    status: ""
}

export const homeSlice = createSlice({
    name: "Home",
    initialState,
    reducers: {
        searchRequest: (state) => {
            state.status = "Request"
        },
        searchSuccess: (state, { payload }) => {
            state.search = payload
           
        },
        searchFailure: (state, { payload }) => {
            state.search = payload
          
        },
        majorDashaRequest: (state) => {
            state.status = "Major_Dasha_Request"
        },
        majorDashaSuccess: (state, { payload }) => {
            state.majorDasha = payload
           
        },
        majorDashaFailure: (state, { payload }) => {
            state.majorDasha = payload
           
        },
        subDashaRequest: (state) => {
            state.status = "SubDasha_Request"
        },
        subDashaSuccess: (state, { payload }) => {
            state.subDasha = payload
            
        },
        subDashaClear: (state) => {
            state.subDasha = []
        },
        subDashaFailure: (state, { payload }) => {
            state.subDasha = payload
           
        },
        subDasha2Request: (state) => {
            state.status = "SubDasha2_Request"
        },
        subDasha2Success: (state, { payload }) => {
            state.subDasha2 = payload
            state.subDasha2.status = "SubDasha2_Success"
        },
        subDasha2Clear: (state) => {
            state.subDasha2 = []
        },
        subDasha2Failure: (state, { payload }) => {
            state.subDasha2 = payload
            state.subDasha2.status = "SubDasha2_Failure"
        },
        subDasha3Request: (state) => {
            state.status = "SubDasha3_Request"
        },
        subDasha3Success: (state, { payload }) => {
            state.subDasha3 = payload
            
        },
        subDasha3Clear: (state) => {
            state.subDasha3 = []
        },
        subDasha3Failure: (state, { payload }) => {
            state.subDasha3 = payload
            
        },
        subDasha4Request: (state) => {
            state.status = "SubDasha4_Request"
        },
        subDasha4Success: (state, { payload }) => {
            state.subDasha4 = payload
            
        },
        subDasha4Clear: (state) => {
            state.subDasha4 = []
        },
        subDasha4Failure: (state, { payload }) => {
            state.subDasha4 = payload
          
        },
    }
})

export const {
    searchRequest, searchSuccess, searchFailure, majorDashaRequest,
    majorDashaSuccess, majorDashaFailure, subDashaRequest, subDashaSuccess,
    subDashaFailure, subDasha2Request, subDasha2Success, subDasha2Failure,
    subDasha3Request, subDasha3Success, subDasha3Failure, subDasha4Request,
    subDasha4Success, subDasha4Failure, subDashaClear, subDasha2Clear, subDasha3Clear, subDasha4Clear } = homeSlice.actions

const home = homeSlice.reducer;
export default home;

export function search(payload) {
    return dispatch => {
        dispatch(searchRequest());
        homeApi.search(payload).then(
            data => { dispatch(searchSuccess(data)) },
            error => { dispatch(searchFailure(error)) }
        )
    }
}

export function majorDasha(payload) {
    return dispatch => {
        dispatch(majorDashaRequest());
        homeApi.majorDasha(payload).then(
            data => { dispatch(majorDashaSuccess(data)) },
            error => { dispatch(majorDashaFailure(error)) }
        )
    }
}

export function subDasha(payload, query) {
    return dispatch => {
        dispatch(subDashaRequest());
        homeApi.subDasha(payload, query).then(
            data => { dispatch(subDashaSuccess(data)) },
            error => { dispatch(subDashaFailure(error)) }
        )
    }
}

export function subDasha2(payload, query) {
    return dispatch => {
        dispatch(subDasha2Request());
        homeApi.subDasha2(payload, query).then(
            data => { dispatch(subDasha2Success(data)) },
            error => { dispatch(subDasha2Failure(error)) }
        )
    }
}

export function subDasha3(payload, query) {
    return dispatch => {
        dispatch(subDasha3Request());
        homeApi.subDasha3(payload, query).then(
            data => { dispatch(subDasha3Success(data)) },
            error => { dispatch(subDasha3Failure(error)) }
        )
    }
}

export function subDasha4(payload, query) {
    return dispatch => {
        dispatch(subDasha4Request());
        homeApi.subDasha4(payload, query).then(
            data => { dispatch(subDasha4Success(data)) },
            error => { dispatch(subDasha4Failure(error)) }
        )
    }
}

export function postCustomerData(payload) {
    return dispatch => {
        homeApi.postData(payload)
    }
}

export function updateCustomerData(payload, docId) {
    return dispatch => {
        homeApi.updateData(payload, docId);
    }
}

export function clearDashaAction() {
    return (dispatch) => {
        dispatch(subDashaClear())
        dispatch(subDasha2Clear())
        dispatch(subDasha3Clear())
        dispatch(subDasha4Clear())
    }
}

export function clearBukthiDataAction() {
    return (dispatch) => {
        dispatch(subDasha2Clear())
        dispatch(subDasha3Clear())
        dispatch(subDasha4Clear())
    }
}

export function clearAnthraData() {
    return (dispatch) => {
        dispatch(subDasha3Clear())
        dispatch(subDasha4Clear())
    }
}

export function clearSukshmaData() {
    return (dispatch) => {
        dispatch(subDasha4Clear())
    }
}
