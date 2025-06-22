import React, { useState, useEffect } from "react";
import {
  Box, Heading, Flex, Button, Spinner, Alert, AlertIcon,
  Select, FormControl, FormLabel, Image, SimpleGrid, useToast, useColorModeValue
} from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { generateVisualization } from "../api";
import { getErrorMessage } from "../utils/errorUtils";

const VisualizationView = ({ fileMeta, data, onStepBack, onStepComplete }) => {
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState("bar");
  const [xCol, setXCol] = useState("");
  const [yCol, setYCol] = useState("");
  const [hueCol, setHueCol] = useState("");
  const [chartImage, setChartImage] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Clean up chart image URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (chartImage) {
        URL.revokeObjectURL(chartImage);
      }
    };
  }, [chartImage]);

  // Get columns from data
  const columns = data?.columns || [];
  const numericColumns = columns.filter(col =>
    data?.dtypes?.[col]?.includes('int') || data?.dtypes?.[col]?.includes('float')
  );
  const categoricalColumns = columns.filter(col =>
    !numericColumns.includes(col)
  );

  // Set default columns
  useEffect(() => {
    if (columns.length > 0) {
      if (!xCol) setXCol(columns[0]);
      if (numericColumns.length > 0 && !yCol) setYCol(numericColumns[0]);
    }
    // eslint-disable-next-line
  }, [columns, numericColumns]);

  const handleGenerateChart = async () => {
    if (!xCol) {
      setError("Please select an X-axis column");
      return;
    }
    if (chartType !== "histogram" && !yCol) {
      setError("Please select a Y-axis column");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await generateVisualization(
        fileMeta.id,
        chartType,
        xCol,
        chartType !== "histogram" ? yCol : undefined,
        hueCol || undefined
      );

      // Clean up previous image
      if (chartImage) {
        URL.revokeObjectURL(chartImage);
      }

      // Create URL for the blob image
      const imageUrl = URL.createObjectURL(response.data);
      setChartImage(imageUrl);
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setError(errorMsg);
      toast({
        title: "Chart generation failed",
        description: errorMsg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const bg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const accent = useColorModeValue("blue.600", "blue.300");

  return (
    <Box w="full" p={8} bg={bg}>
      <Flex align="center" mb={8}>
        <Heading size="lg" color={accent}>Data Visualization</Heading>
      </Flex>

      {loading && (
        <Flex justify="center" mb={6}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      )}

      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md" mb={8}>
        <Heading size="md" mb={4} color={accent}>Chart Configuration</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl>
            <FormLabel>Chart Type</FormLabel>
            <Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="scatter">Scatter Plot</option>
              <option value="histogram">Histogram</option>
              <option value="box">Box Plot</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>X-axis Column</FormLabel>
            <Select
              value={xCol}
              onChange={(e) => setXCol(e.target.value)}
            >
              {columns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </Select>
          </FormControl>
          {chartType !== "histogram" && (
            <FormControl>
              <FormLabel>Y-axis Column</FormLabel>
              <Select
                value={yCol}
                onChange={(e) => setYCol(e.target.value)}
              >
                {numericColumns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControl>
            <FormLabel>Group By (Optional)</FormLabel>
            <Select
              value={hueCol}
              onChange={(e) => setHueCol(e.target.value)}
              placeholder="Select column"
            >
              <option value="">None</option>
              {categoricalColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>
        <Button
          colorScheme="blue"
          mt={4}
          onClick={handleGenerateChart}
          isLoading={loading}
        >
          Generate Chart
        </Button>
      </Box>

      {chartImage && (
        <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md" mb={8}>
          <Heading size="md" mb={4} color={accent}>Chart Preview</Heading>
          <Image
            src={chartImage}
            alt="Generated chart"
            maxW="100%"
          />
        </Box>
      )}

      <Flex justify="space-between">
        <Button
          colorScheme="blue"
          variant="outline"
          leftIcon={<FiArrowLeft />}
          onClick={onStepBack}
        >
          Back to Outlier Detection
        </Button>
        <Button
          colorScheme="blue"
          rightIcon={<FiArrowRight />}
          onClick={onStepComplete}
        >
          Continue to Report Generation
        </Button>
      </Flex>
    </Box>
  );
};

export default VisualizationView;
