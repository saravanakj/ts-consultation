export const Error ={
    show
};

function show(error){
    if(error.code>501 && error.code <=-504){
        alert("Heavy Traffic in our Server")
    }
    else{
        if(error.message.indexOf("JSON Parse error") !==-1){
            alert("Server Down")
        }
    }
}