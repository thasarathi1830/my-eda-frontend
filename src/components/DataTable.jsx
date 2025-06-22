import React, { useState, useEffect } from 'react';
import {
  Box, Table, Thead, Tbody, Tr, Th, Td, Button,
  HStack, Text, Select, Checkbox, VStack, useToast,
  Spinner, Alert, AlertIcon, Tooltip, Badge, Icon
} from '@chakra-ui/react';
import { FiTrash2, FiInfo, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';

const DataTable = ({ refreshTrigger }) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();

  const fetchTableData = async () => {
    setLoading(true);
    try {
      // Updated to FastAPI endpoint
      const response = await axios.get('http://localhost:8000/current_data');
      setTableData(response.data.data || []);
      setColumns(response.data.columns || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch table data');
      toast({
        title: 'Error',
        description: 'Could not load table data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [refreshTrigger]);

  const handleColumnSelect = (column) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column) 
        : [...prev, column]
    );
  };

  const removeSelectedColumns = async () => {
    if (selectedColumns.length === 0) return;
    
    try {
      // Updated to FastAPI endpoint
      await axios.post('http://localhost:8000/cleaning/remove', {
        columns: selectedColumns
      });
      
      toast({
        title: 'Columns removed',
        description: `${selectedColumns.length} columns removed successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setSelectedColumns([]);
      fetchTableData();  // Refresh data after removal
    } catch (err) {
      toast({
        title: 'Error removing columns',
        description: err.response?.data?.error || 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading data...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {/* Column Selection */}
      <Box bg="blue.50" p={4} borderRadius="md">
        <HStack justify="space-between">
          <Text fontWeight="bold">Select columns to remove:</Text>
          <Button
            colorScheme="red"
            leftIcon={<FiTrash2 />}
            onClick={removeSelectedColumns}
            isDisabled={selectedColumns.length === 0}
          >
            Remove Selected ({selectedColumns.length})
          </Button>
        </HStack>
        
        <HStack wrap="wrap" spacing={2} mt={2}>
          {columns.map(col => (
            <Checkbox
              key={col}
              isChecked={selectedColumns.includes(col)}
              onChange={() => handleColumnSelect(col)}
              colorScheme="red"
              px={3}
              py={1}
              bg="white"
              borderRadius="md"
            >
              {col}
            </Checkbox>
          ))}
        </HStack>
      </Box>

      {/* Table */}
      <Box overflowX="auto" maxH="500px" overflowY="auto" border="1px solid" borderColor="gray.200" borderRadius="md">
        <Table variant="striped" size="sm">
          <Thead position="sticky" top={0} bg="white" zIndex={1} boxShadow="sm">
            <Tr>
              {columns.map(col => (
                <Th key={col} minW="120px" position="sticky" top={0} bg="blue.50">
                  {col}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((row, idx) => (
              <Tr key={idx} _hover={{ bg: 'gray.50' }}>
                {columns.map(col => (
                  <Td key={col} maxW="300px" overflow="hidden" textOverflow="ellipsis">
                    {row[col] === null ? <Badge colorScheme="red">NULL</Badge> : String(row[col])}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Refresh Button */}
      <Button
        leftIcon={<FiRefreshCw />}
        onClick={fetchTableData}
        colorScheme="blue"
      >
        Refresh Data
      </Button>
    </VStack>
  );
};

export default DataTable;
