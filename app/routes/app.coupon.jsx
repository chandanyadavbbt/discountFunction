// import { useEffect } from "react"
// import { authenticate } from "~/shopify.server"
// export const ActionFunction=async({request})=>{
//     const {admin} = await  authenticate.admin(request)
//     const response = await admin.rest.resources.Collection.find({session,id:841564295})
// }

// function CouponPage() {

//     useEffect(()=>{
//        const discount_code= localStorage.getItem("discount_code")
//        const zingImpressionId= localStorage.getItem("zingImpressionId")
//        const zingFallbackDiscountCode= localStorage.getItem("zingFallbackDiscountCode")
//         console.log(discount_code,zingFallbackDiscountCode,zingImpressionId,"this is coupon page")
//     //    async function getProducts(){
//     //    const response= await admin.rest.resources.Collection.find({
//     //         session: session,
//     //         id: 841564295,
//     //       });
//     //    }
//     },[])
//   return (
//     <div>CouponPage</div>
//   )
// }

// export default CouponPage
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { authenticate } from "~/shopify.server"

export async function loader({request}){
    const {admin,session} = await authenticate.admin(request);

    const count = await admin.rest.resources.DiscountCode.count({session:session})

    return json({
        count,
        ok:true,
        message:"Hello from remix"
    })
}

function CouponPage(){
    const loaderData = useLoaderData()
    const {message,count} =loaderData
    console.log(message)

    return (
        <>
        <h1>This is coupon page</h1>
        <p>{message}</p>
        <p>Discount</p>
        </>
    )
}

export default CouponPage