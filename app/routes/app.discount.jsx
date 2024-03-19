// @ts-nocheck
import { json } from '@remix-run/node'
import { useActionData, useSubmit } from '@remix-run/react'
import { authenticate } from '~/shopify.server'
import { action } from './app._index'


// action component 
export const ActionFunction = async({request})=>{
  const {admin} = await authenticate.admin(request)
  try {
    const disocountTitle="Test discount"
    const startsAt="2022-06-21T00:00:00Z";
    const endsAt="2022-0-21T00:00:00Z";
    const minimumRequirementSubtotal=2;
    const discountAmount= 3
    const response = await admin.graphql(
    
  `#graphql
  mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode {
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            codes(first: 10) {
              nodes {
                code
              }
            }
            startsAt
            endsAt
            customerSelection {
              ... on DiscountCustomerAll {
                allCustomers
              }
            }
            customerGets {
              value {
                ... on DiscountPercentage {
                  percentage
                }
              }
              items {
                ... on AllDiscountItems {
                  allItems
                }
              }
            }
            appliesOncePerCustomer
          }
        }
      }
      userErrors {
        field
        code
        message
      }
    }
  }`,
  {
    variables: {
      "basicCodeDiscount": {
        "title": "20% off all items during the summer of 2022",
        "code": "SUMMER20",
        "startsAt": "2022-06-21T00:00:00Z",
        "endsAt": "2024-09-21T00:00:00Z",
        "customerSelection": {
          "all": true
        },
        "customerGets": {
          "value": {
            "percentage": 0.2
          },
          "items": {
            "all": true
          }
        },
        "appliesOncePerCustomer": true
      }
    },
  },
);

if(response.ok){
  const reponseJson = await response.json()
  console.log("create discount")

  return json({
    discount:reponseJson.data
  })
}
return null


  } catch (error) {
    
  }
}

function DiscountPage() {
  // const submit =useSubmit();
  // const actionData=useActionData<typeof action>()
  // console.log(actionData,"actiondata")
  // const generateDiscount =()=>submit 
  return (
    <div>DiscountPage</div>
  )
}

export default DiscountPage