import React, { useState, useEffect } from "react";
import {
  Box, Heading, Flex, VStack, HStack, Text, Button, Table,
  Thead, Tbody, Tr, Th, Td, Badge, useToast,
  Alert, AlertIcon, Spinner, useColorModeValue
} from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { getOverview } from "../api";  // Now properly imported
import { getErrorMessage } from "../utils/errorUtils";

const OverviewView = ({ fileMeta, data, onDataUpdate, onStepBack, onStepComplete }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const toast = useToast();
  
  const bg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const accent = useColorModeValue("blue.600", "blue.300");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await getOverview(fileMeta.id);
        setStats(response.data);
        onDataUpdate({
          shape: response.data.shape,
          nullCounts: response.data.null_counts
        });
      } catch (error) {
        const errorMsg = getErrorMessage(error);
        setError(errorMsg);
        toast({
          title: "Data load failed",
          description: errorMsg,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOverview();
  }, [fileMeta.id]);

  const handleContinue = () => {
    onStepComplete();
  };

  return (
    <Box w="full" p={8} bg={bg}>
      <Flex align="center" mb={8}>
        <Heading size="lg" color={accent}>Data Overview</Heading>
      </Flex>

      {loading && (
        <Flex justify="center" mb={6}>
          <Spinner size="xl" color="blue.500" />
          <Text ml={4}>Loading dataset analysis...</Text>
        </Flex>
      )}

      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {stats && (
        <VStack spacing={6} align="stretch">
          <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md">
            <Heading size="md" mb={4}>Dataset Summary</Heading>
            <HStack spacing={8}>
              <Box>
                <Text><b>File Name:</b> {stats.filename}</Text>
                <Text><b>Total Rows:</b> {stats.shape[0]}</Text>
                <Text><b>Total Columns:</b> {stats.shape[1]}</Text>
              </Box>
              <Box>
                <Text><b>Missing Values:</b> {Object.values(stats.null_counts).reduce((a, b) => a + b, 0)}</Text>
                <Text><b>Categorical Columns:</b> {
                  Object.entries(stats.dtypes)
                    .filter(([col, dtype]) => dtype === 'object')
                    .map(([col]) => col)
                    .join(', ')
                }</Text>
              </Box>
            </HStack>
          </Box>

          <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md">
            <Heading size="md" mb={4}>Column Details</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Column</Th>
                  <Th>Data Type</Th>
                  <Th>Missing Values</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stats.columns.map((col) => (
                  <Tr key={col}>
                    <Td>{col}</Td>
                    <Td>
                      <Badge colorScheme={
                        stats.dtypes[col].includes('int') ? 'green' : 
                        stats.dtypes[col].includes('float') ? 'blue' : 'orange'
                      }>
                        {stats.dtypes[col]}
                      </Badge>
                    </Td>
                    <Td>{stats.null_counts[col]}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md">
            <Heading size="md" mb={4}>Data Preview</Heading>
            <Box overflowX="auto">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    {stats.columns.map((col) => (
                      <Th key={col}>{col}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {stats.head.map((row, i) => (
                    <Tr key={i}>
                      {stats.columns.map((col) => (
                        <Td key={col}>{row[col]}</Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </VStack>
      )}

      <Flex justify="space-between" mt={8}>
        <Button
          colorScheme="blue"
          variant="outline"
          leftIcon={<FiArrowLeft />}
          onClick={onStepBack}
        >
          Upload New File
        </Button>
        <Button
          colorScheme="blue"
          rightIcon={<FiArrowRight />}
          onClick={handleContinue}
          isDisabled={!stats}
        >
          Continue to Data Cleaning
        </Button>
      </Flex>
    </Box>
  );
};

export default OverviewView;
