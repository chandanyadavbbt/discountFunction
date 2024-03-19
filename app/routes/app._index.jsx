import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  VerticalStack,
  Card,
  Button,
  HorizontalStack,
  Box,
  Divider,
  List,
  Link,
} from "@shopify/polaris";
// importing react localstorage


import { authenticate } from "../shopify.server";
// zing backend apis
        // const response = await fetch("https://zing-api-prod.herokuapp.com/tenant/beautiful-disaster-clothing.myshopify.com");
        let zingBackend = "https://zing-api-prod.herokuapp.com"

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  return json({ shop: session.shop.replace(".myshopify.com", "") });
};

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    }
  );

  const responseJson = await response.json();

  // comment to check the response 
  
  return json({
    product: responseJson.data.productCreate.product,
  });
}
console.log("this is heello from app")

export default function Index() {
  const nav = useNavigation();
  const { shop } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();

  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    ""
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);


  // use state for get zing data 
  const [popupData,setPopupData]=useState(null)
  const [impressionId,setImpressionId]=useState(null)
  const [email,setEmail]=useState(null)

  // use effect for zing
  useEffect(()=>{
    const  getZing = async()=>{
        const response = await fetch("https://zing-api-prod.herokuapp.com/tenant/beautiful-disaster-clothing.myshopify.com")
        const data = await response.json()
        setPopupData(data.template)
        setImpressionId(data.impressionId)
        // console.log(data , "this is fetched data")
      }
      getZing()
  },[])
  // console.log(email,"this is state data")

  // handle email button
  function  handleEmail(el){
    setEmail(el.target.value)
  }
  // handle button submit 
  async function handleSubmit(){
    try {
      const payload = {
        email,
        storeKey: 'beautiful-disaster-clothing.myshopify.com',
        impressionId,
      };
      const response = await fetch('https://zing-api-prod.herokuapp.com/optin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log('Opt-in response:', data);
      localStorage.setItem("discount_code",data.fallbackCoupon)
      localStorage.setItem("zingFallbackDiscountCode",data.fallbackCoupon)
      localStorage.setItem("zingImpressionId",data.id)
      
    } catch (error) {
      console.log(error)
    }
  }

  // local storage set item

  const generateProduct = () => submit({}, { replace: true, method: "POST" });

  return (
    <Page>
     <input  onChange={handleEmail} value={email} type= "email" placeholder="Enter the email id"/>
     <button onClick={handleSubmit}>Submit</button>
    </Page>
  );
}
