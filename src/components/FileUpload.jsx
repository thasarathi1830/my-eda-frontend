import React, { useState, useRef } from 'react';
import {
  Box, Heading, Text, Flex, VStack, Icon, Button, 
  useColorModeValue, Alert, AlertIcon, Progress,
  Input, FormControl, useToast
} from '@chakra-ui/react';
import { FiUpload, FiFile } from 'react-icons/fi';
import { uploadFile } from '../api';
import { getErrorMessage } from '../utils/errorUtils';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const toast = useToast();
  
  const bg = useColorModeValue('white', 'gray.800');
  const accent = useColorModeValue('blue.600', 'blue.300');
  const cardBg = useColorModeValue('blue.50', 'gray.700');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const extension = selectedFile.name.slice(selectedFile.name.lastIndexOf(".")).toLowerCase();
    
    if (!validExtensions.includes(extension)) {
      setMessage({ 
        type: 'error', 
        text: 'Please upload CSV or Excel files only' 
      });
      return;
    }
    
    if (selectedFile.size > 100 * 1024 * 1024) {
      setMessage({ 
        type: 'error', 
        text: 'File size must be less than 100MB' 
      });
      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setMessage({ type: '', text: '' });
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);
      
      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      };

      const response = await uploadFile(file, config);
      
      // Direct access to response.data since backend returns the data directly
      if (!response.data.file_id) {
        throw new Error('Upload failed: No file ID returned from server');
      }
      
      onUploadSuccess(response.data);
      
      toast({
        title: "Upload Successful!",
        description: `${file.name} has been processed`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      setMessage({ type: 'success', text: 'File uploaded successfully!' });
      
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setMessage({ type: 'error', text: errorMsg });
      
      toast({
        title: "Upload Failed",
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
    <Flex minH="100vh" align="center" justify="center" p={8}>
      <Box 
        w="100%" 
        maxW="600px" 
        bg={bg} 
        p={8} 
        borderRadius="xl" 
        boxShadow="xl"
        textAlign="center"
      >
        <VStack spacing={8}>
          <Box>
            <Heading size="xl" color={accent} mb={4}>
              Data Analysis Hub
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Upload your dataset to begin exploration
            </Text>
          </Box>

          <FormControl>
            <Flex
              border="2px dashed"
              borderColor="blue.300"
              borderRadius="xl"
              p={12}
              direction="column"
              align="center"
              justify="center"
              cursor="pointer"
              bg={cardBg}
              _hover={{ bg: 'blue.100', borderColor: 'blue.400' }}
              onClick={() => fileInputRef.current.click()}
              transition="all 0.3s"
            >
              <Icon as={FiFile} boxSize={12} color="blue.500" mb={4} />
              <Text fontWeight="bold" mb={2} fontSize="xl">
                Select Dataset
              </Text>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Supported formats: .csv, .xlsx, .xls
              </Text>
              <Box bg="white" borderRadius="md" px={4} py={2}>
                <Text fontSize="md" color="blue.600" fontWeight="600">
                  {fileName}
                </Text>
              </Box>
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                ref={fileInputRef}
                display="none"
              />
            </Flex>
          </FormControl>

          {loading && (
            <Box w="100%">
              <Flex justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.600">Processing...</Text>
                <Text fontSize="sm" fontWeight="bold">{uploadProgress}%</Text>
              </Flex>
              <Progress
                value={uploadProgress}
                colorScheme="blue"
                size="sm"
                borderRadius="full"
                hasStripe
                isAnimated
              />
            </Box>
          )}

          <Button
            colorScheme="blue"
            onClick={handleUpload}
            isLoading={loading}
            loadingText="Analyzing..."
            isDisabled={!file || loading}
            w="100%"
            size="lg"
            py={6}
            fontSize="xl"
            leftIcon={<FiUpload />}
          >
            {file ? 'Analyze Dataset' : 'Select File First'}
          </Button>

          {message.text && (
            <Alert status={message.type} borderRadius="xl">
              <AlertIcon />
              {message.text}
            </Alert>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};

export default FileUpload;
