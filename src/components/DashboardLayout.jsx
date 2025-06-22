import React from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const Dashboard = () => (
  <Box>
    <Heading size="lg" mb={4}>
      Welcome to the Dashboard!
    </Heading>
    <VStack align="start" spacing={3}>
      <Text fontSize="md" color="gray.600">
        Start your data exploration journey.
      </Text>
      <Text fontSize="md" color="gray.600">
        Use the sidebar to navigate between steps.
      </Text>
    </VStack>
  </Box>
);

export default Dashboard;
