import { json } from "@remix-run/node";


export async function loader(){
return json({
    ok:true,
    message:"Hello from remix"
})
}


// post request 
export async function action({request}){
    const method = request.method
    switch(method){
        case "POST":
            return json({messgae:"success",method:"POST"})
            break;
            case "PATCH":
            return json({messgae:"success",method:"PATCH"})
            break;
        default:
            return new Response("Method not allowd",{
                status:405
            })
    }
    return json({messgae:"success"})
}