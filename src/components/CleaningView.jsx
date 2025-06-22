import React, { useState } from "react";
import {
  Box, Heading, Text, Flex, VStack, HStack, Icon, Table, Thead, Tbody,
  Tr, Th, Td, Badge, Spinner, Button, useColorModeValue, Alert, AlertIcon,
  SimpleGrid, Input, Select, RadioGroup, Radio, FormControl, FormLabel,
  useToast, Checkbox, Stack
} from "@chakra-ui/react";
import { FiTrash2, FiEdit, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { removeColumns, fillMissing } from "../api";
import { getErrorMessage } from "../utils/errorUtils";

const CleaningView = ({ fileMeta, data, onDataUpdate, onStepBack, onStepComplete }) => {
  const [loading, setLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [method, setMethod] = useState('mean');
  const [customValue, setCustomValue] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [actionHistory, setActionHistory] = useState([]);
  const toast = useToast();

  const columns = data?.columns || [];
  const dtypes = data?.dtypes || {};
  const nullCounts = data?.nullCounts || {};
  const tableData = data?.tableData || [];
  const shape = data?.shape || [0, 0];

  const columnsWithMissingValues = columns.filter(col => nullCounts[col] > 0);
  const numericColumns = columns.filter(col => {
    const dtype = dtypes[col] || '';
    return dtype.includes('int') || dtype.includes('float');
  });

  const handleRemoveColumns = async () => {
    if (selectedColumns.length === 0) {
      setMessage({ type: 'error', text: 'Please select columns to remove' });
      return;
    }
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      const response = await removeColumns(fileMeta.id, selectedColumns);
      onDataUpdate({
        columns: response.data.remaining_columns,
        dtypes: response.data.dtypes,
        nullCounts: response.data.null_counts,
        tableData: response.data.head,
        shape: response.data.shape,
        action: response.data.action
      });
      setActionHistory(prev => [...prev, response.data.action]);
      setSelectedColumns([]);
      toast({
        title: "Columns removed",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setMessage({ type: 'error', text: errorMsg });
      toast({
        title: "Error",
        description: errorMsg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFillMissing = async () => {
    if (!selectedColumn) {
      setMessage({ type: 'error', text: 'Please select a column' });
      return;
    }
    if (method === 'custom' && !customValue) {
      setMessage({ type: 'error', text: 'Please enter a custom value' });
      return;
    }
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      const response = await fillMissing(
        fileMeta.id,
        selectedColumn,
        method,
        method === 'custom' ? customValue : undefined
      );
      onDataUpdate({
        nullCounts: response.data.null_counts,
        tableData: response.data.head,
        shape: response.data.shape,
        action: response.data.action
      });
      setActionHistory(prev => [...prev, response.data.action]);
      setSelectedColumn('');
      setCustomValue('');
      setMethod('mean');
      toast({
        title: "Missing values filled",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setMessage({ type: 'error', text: errorMsg });
      toast({
        title: "Error",
        description: errorMsg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFillMethods = () => {
    if (!selectedColumn) return null;
    const isNumeric = numericColumns.includes(selectedColumn);
    return (
      <RadioGroup value={method} onChange={setMethod} mb={4}>
        <Stack direction="row" wrap="wrap" spacing={4}>
          {isNumeric ? (
            <>
              <Radio value="mean">Mean</Radio>
              <Radio value="median">Median</Radio>
              <Radio value="mode">Mode</Radio>
              <Radio value="custom">Custom Value</Radio>
            </>
          ) : (
            <>
              <Radio value="mode">Mode</Radio>
              <Radio value="custom">Custom Value</Radio>
            </>
          )}
        </Stack>
      </RadioGroup>
    );
  };

  const bg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const accent = useColorModeValue("blue.600", "blue.300");

  return (
    <Box w="full" p={8} bg={bg}>
      <Flex align="center" mb={8}>
        <Icon as={FiEdit} boxSize={8} color={accent} mr={4} />
        <Heading size="lg" color={accent}>Data Cleaning</Heading>
      </Flex>

      {loading && (
        <Flex justify="center" mb={6}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      )}

      {message.text && (
        <Alert status={message.type} mb={6}>
          <AlertIcon />
          {message.text}
        </Alert>
      )}

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
        <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md">
          <Heading size="md" mb={4} color={accent}>Remove Columns</Heading>
          <FormControl mb={4}>
            <FormLabel>Select columns to remove:</FormLabel>
            <Box maxH="200px" overflowY="auto" borderWidth="1px" borderRadius="md" p={2}>
              <Stack spacing={2}>
                {columns.map(col => (
                  <Checkbox 
                    key={col}
                    isChecked={selectedColumns.includes(col)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedColumns([...selectedColumns, col]);
                      } else {
                        setSelectedColumns(selectedColumns.filter(c => c !== col));
                      }
                    }}
                  >
                    {col} <Badge ml={2}>{dtypes[col]}</Badge>
                  </Checkbox>
                ))}
              </Stack>
            </Box>
          </FormControl>
          <Button
            colorScheme="red"
            leftIcon={<FiTrash2 />}
            onClick={handleRemoveColumns}
            isDisabled={selectedColumns.length === 0}
            w="full"
          >
            Remove Selected Columns
          </Button>
        </Box>

        <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md">
          <Heading size="md" mb={4} color={accent}>Fill Missing Values</Heading>
          <FormControl mb={4}>
            <FormLabel>Select column:</FormLabel>
            <Select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              placeholder="Select column with missing values"
            >
              {columnsWithMissingValues.map(col => (
                <option key={col} value={col}>
                  {col} ({nullCounts[col]} missing)
                </option>
              ))}
            </Select>
          </FormControl>
          
          <FormControl mb={4}>
            <FormLabel>Fill method:</FormLabel>
            {renderFillMethods()}
          </FormControl>
          
          {method === "custom" && (
            <FormControl mb={4}>
              <Input
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Enter custom value"
              />
            </FormControl>
          )}
          
          <Button
            colorScheme="blue"
            leftIcon={<FiEdit />}
            onClick={handleFillMissing}
            isDisabled={!selectedColumn}
            w="full"
          >
            Fill Missing Values
          </Button>
        </Box>
      </SimpleGrid>

      <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md" mb={8}>
        <Heading size="md" mb={4} color={accent}>Action History</Heading>
        <VStack align="start" spacing={2} maxH="200px" overflowY="auto">
          {actionHistory.length === 0 ? (
            <Text color="gray.500">No actions performed yet</Text>
          ) : (
            actionHistory.map((action, idx) => (
              <HStack key={idx} bg="white" p={2} borderRadius="md" w="full">
                <Icon as={FiEdit} color="green.500" />
                <Text>{action}</Text>
              </HStack>
            ))
          )}
        </VStack>
      </Box>

      <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md" mb={8}>
        <Heading size="md" mb={4} color={accent}>Current Data Preview</Heading>
        <Box maxH="300px" overflowY="auto">
          <Table size="sm" variant="simple">
            <Thead position="sticky" top={0} bg={useColorModeValue('blue.50', 'gray.600')}>
              <Tr>
                <Th>#</Th>
                {columns.map(col => <Th key={col}>{col}</Th>)}
              </Tr>
            </Thead>
            <Tbody>
              {tableData.slice(0, 10).map((row, idx) => (
                <Tr key={idx}>
                  <Td fontWeight="bold">{idx + 1}</Td>
                  {columns.map(col => (
                    <Td key={col} maxW="200px" overflow="hidden" textOverflow="ellipsis">
                      {row[col] === null ? 
                        <Badge colorScheme="red">NULL</Badge> : 
                        String(row[col])
                      }
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      <Flex justify="space-between">
        <Button
          colorScheme="blue"
          variant="outline"
          leftIcon={<FiArrowLeft />}
          onClick={onStepBack}
        >
          Back to Overview
        </Button>
        <Button
          colorScheme="blue"
          rightIcon={<FiArrowRight />}
          onClick={onStepComplete}
        >
          Continue to Outlier Detection
        </Button>
      </Flex>
    </Box>
  );
};

export default CleaningView;
