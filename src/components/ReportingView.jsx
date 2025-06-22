import React, { useState, useEffect } from "react";
import {
  Box, Heading, Flex, VStack, Text, Button, Spinner, useToast,
  Alert, AlertIcon, useColorModeValue, Badge, HStack, Icon
} from "@chakra-ui/react";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { getErrorMessage } from "../utils/errorUtils";

const ReportingView = ({ fileMeta, data, actionHistory, onStepBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  
  const bg = useColorModeValue("white", "gray.800");
  const accent = useColorModeValue("blue.600", "blue.300");
  const cardBg = useColorModeValue("blue.50", "gray.700");
  const successColor = useColorModeValue("green.600", "green.300");

  // Clean up function for any resources
  useEffect(() => {
    return () => {
      // Cleanup logic if needed
    };
  }, []);

  const generateSummary = () => {
    if (!actionHistory || actionHistory.length === 0) {
      return "No actions performed during this session.";
    }

    const summary = actionHistory.map((action, index) => (
      <HStack key={index} spacing={3} align="start">
        <Icon as={FiCheckCircle} color={successColor} mt={1} />
        <Text fontSize="md">{action}</Text>
      </HStack>
    ));

    return (
      <VStack align="start" spacing={3}>
        {summary}
      </VStack>
    );
  };

  return (
    <Box w="full" p={8} bg={bg}>
      <Flex align="center" mb={8}>
        <Heading size="lg" color={accent}>EDA Report Summary</Heading>
      </Flex>

      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <VStack spacing={8} align="stretch">
        <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md">
          <Heading size="md" mb={4} color={accent}>Dataset Information</Heading>
          <VStack align="start" spacing={2}>
            <Text><strong>File Name:</strong> {fileMeta?.filename || 'N/A'}</Text>
            <Text><strong>Total Actions:</strong> {actionHistory?.length || 0}</Text>
            <Text><strong>Final Dimensions:</strong> {data?.shape?.join(' × ') || 'N/A'}</Text>
          </VStack>
        </Box>

        <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md">
          <Heading size="md" mb={4} color={accent}>Action Summary</Heading>
          <Box maxH="400px" overflowY="auto" p={2}>
            {generateSummary()}
          </Box>
        </Box>

        <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md">
          <Heading size="md" mb={4} color={accent}>Analysis Completed</Heading>
          <HStack spacing={3}>
            <Badge colorScheme="green" p={2} borderRadius="md">
              Data Cleaning
            </Badge>
            <Badge colorScheme="green" p={2} borderRadius="md">
              Outlier Handling
            </Badge>
            <Badge colorScheme="green" p={2} borderRadius="md">
              Visualization
            </Badge>
          </HStack>
          <Text mt={4} fontStyle="italic">
            Your exploratory data analysis is complete. You can review the actions above or start a new analysis.
          </Text>
        </Box>
      </VStack>

      <Flex justify="space-between" mt={8}>
        <Button
          colorScheme="blue"
          variant="outline"
          leftIcon={<FiArrowLeft />}
          onClick={onStepBack}
        >
          Back to Visualization
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => {
            toast({
              title: "Analysis Complete",
              description: "Your EDA session has been successfully completed",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }}
        >
          Finish Session
        </Button>
      </Flex>
    </Box>
  );
};

export default ReportingView;
