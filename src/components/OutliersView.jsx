import React, { useState } from "react";
import {
  Box, Heading, Flex, VStack, Text, Button, Select, FormControl, FormLabel,
  Alert, AlertIcon, Spinner, useToast, useColorModeValue, Badge, HStack
} from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { detectOutliers, handleOutliers } from "../api";
import { getErrorMessage } from "../utils/errorUtils";

const OutliersView = ({ fileMeta, data, onDataUpdate, onStepBack, onStepComplete }) => {
  const [loading, setLoading] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [method, setMethod] = useState("iqr");
  const [outlierData, setOutlierData] = useState(null);
  const [action, setAction] = useState("remove");
  const [error, setError] = useState(null);
  const toast = useToast();
  
  const bg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const accent = useColorModeValue("blue.600", "blue.300");

  // Get numeric columns
  const numericColumns = data?.columns.filter(col => {
    const dtype = data.dtypes[col] || '';
    return dtype.includes('int') || dtype.includes('float');
  }) || [];

  const handleDetect = async () => {
    if (!selectedColumn) {
      setError("Please select a column");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await detectOutliers(fileMeta.id, selectedColumn, method);
      setOutlierData(response.data);
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setError(errorMsg);
      toast({
        title: "Detection failed",
        description: errorMsg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHandleOutliers = async () => {
    if (!outlierData || !outlierData.outlier_indices) {
      setError("No outliers detected");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await handleOutliers(
        fileMeta.id,
        action,
        selectedColumn,
        outlierData.outlier_indices
      );
      onDataUpdate({
        tableData: response.data.head,
        action: response.data.action
      });
      toast({
        title: "Outliers handled",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setError(errorMsg);
      toast({
        title: "Handling failed",
        description: errorMsg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box w="full" p={8} bg={bg}>
      <Flex align="center" mb={8}>
        <Heading size="lg" color={accent}>Outlier Detection</Heading>
      </Flex>

      {loading && (
        <Flex justify="center" mb={6}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      )}

      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </Alert>
      )}

      <VStack spacing={6} align="stretch">
        <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md">
          <Heading size="md" mb={4} color={accent}>Detect Outliers</Heading>
          <FormControl mb={4}>
            <FormLabel>Select Column</FormLabel>
            <Select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              placeholder="Select numeric column"
            >
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Detection Method</FormLabel>
            <Select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="iqr">IQR (Interquartile Range)</option>
              <option value="zscore">Z-Score</option>
            </Select>
          </FormControl>
          <Button
            colorScheme="blue"
            onClick={handleDetect}
            isDisabled={!selectedColumn}
          >
            Detect Outliers
          </Button>
        </Box>

        {outlierData && (
          <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md">
            <Heading size="md" mb={4} color={accent}>Outlier Information</Heading>
            <HStack spacing={4}>
              <Badge colorScheme="red" p={2} borderRadius="md">
                Outliers: {outlierData.outlier_count}
              </Badge>
              {outlierData.lower_bound && (
                <Text><b>Lower Bound:</b> {outlierData.lower_bound.toFixed(2)}</Text>
              )}
              {outlierData.upper_bound && (
                <Text><b>Upper Bound:</b> {outlierData.upper_bound.toFixed(2)}</Text>
              )}
            </HStack>

            <Heading size="sm" mt={4} mb={2}>Handle Outliers</Heading>
            <FormControl mb={4}>
              <FormLabel>Action</FormLabel>
              <Select
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option value="remove">Remove Outliers</option>
                <option value="cap">Cap Values</option>
                <option value="mark">Mark as Outliers</option>
              </Select>
            </FormControl>
            <Button
              colorScheme="blue"
              onClick={handleHandleOutliers}
            >
              Apply Action
            </Button>
          </Box>
        )}
      </VStack>

      <Flex justify="space-between" mt={8}>
        <Button
          colorScheme="blue"
          variant="outline"
          leftIcon={<FiArrowLeft />}
          onClick={onStepBack}
        >
          Back to Data Cleaning
        </Button>
        <Button
          colorScheme="blue"
          rightIcon={<FiArrowRight />}
          onClick={onStepComplete}
          isDisabled={!outlierData}
        >
          Continue to Visualization
        </Button>
      </Flex>
    </Box>
  );
};

export default OutliersView;
