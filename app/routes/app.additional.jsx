import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  VerticalStack,
} from "@shopify/polaris";

export default function AdditionalPage() {
  return (
    <Page>
      <ui-title-bar title="Additional page" />
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="1"
      paddingInlineEnd="1"
      background="bg-subdued"
      borderWidth="1"
      borderColor="border"
      borderRadius="1"
    >
      <code>{children}</code>
    </Box>
  );
}
