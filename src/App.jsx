import React, { useState } from "react";
import { ChakraProvider, Box, Flex } from "@chakra-ui/react";
import FileUpload from "./components/FileUpload";
import OverviewView from "./components/OverviewView";
import CleaningView from "./components/CleaningView";
import OutliersView from "./components/OutliersView";
import VisualizationView from "./components/VisualizationView";
import ReportingView from "./components/ReportingView";
import Sidebar from "./components/Sidebar";
import theme from "./theme";

function App() {
  const [step, setStep] = useState(0);
  const [fileMeta, setFileMeta] = useState(null);
  const [data, setData] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  const [actionHistory, setActionHistory] = useState([]);

  const handleUploadSuccess = (response) => {
    setFileMeta({
      id: response.file_id,
      filename: response.filename
    });
    setData({
      columns: response.columns,
      dtypes: response.dtypes,
      nullCounts: response.null_counts,
      tableData: response.head,
      shape: response.shape
    });
    setStep(1);
    setCompletedSteps([0]);
  };

  const handleDataUpdate = (newData) => {
    setData(prev => ({ ...prev, ...newData }));
    if (newData.action) {
      setActionHistory(prev => [...prev, newData.action]);
    }
  };

  const handleStepComplete = () => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
    setStep(step + 1);
  };

  const handleStepBack = () => {
    setStep(step - 1);
  };

  const handleRestart = () => {
    setStep(0);
    setFileMeta(null);
    setData({});
    setCompletedSteps([]);
    setActionHistory([]);
  };

  const stepsComponents = [
    <FileUpload onUploadSuccess={handleUploadSuccess} key="upload" />,
    <OverviewView 
      fileMeta={fileMeta} 
      data={data} 
      onDataUpdate={handleDataUpdate}
      onStepBack={handleRestart} 
      onStepComplete={handleStepComplete} 
      key="overview" 
    />,
    <CleaningView 
      fileMeta={fileMeta} 
      data={data} 
      onDataUpdate={handleDataUpdate}
      onStepBack={handleStepBack} 
      onStepComplete={handleStepComplete} 
      key="cleaning" 
    />,
    <OutliersView 
      fileMeta={fileMeta} 
      data={data} 
      onDataUpdate={handleDataUpdate}
      onStepBack={handleStepBack} 
      onStepComplete={handleStepComplete} 
      key="outliers" 
    />,
    <VisualizationView 
      fileMeta={fileMeta} 
      data={data} 
      onStepBack={handleStepBack} 
      onStepComplete={handleStepComplete} 
      key="visualization" 
    />,
    <ReportingView 
      fileMeta={fileMeta} 
      data={data} 
      actionHistory={actionHistory}
      onStepBack={handleStepBack} 
      onRestart={handleRestart} // Added this prop
      key="report" 
    />
  ];

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
        <Flex flex="1" minH="0">
          {/* Fixed-width sidebar */}
          <Box 
            w="250px" 
            flexShrink={0} 
            borderRight="1px solid" 
            borderColor="gray.200"
            overflowY="auto"
          >
            <Sidebar 
              step={step} 
              completedSteps={completedSteps} 
              onRestart={handleRestart} 
            />
          </Box>
          
          {/* Scrollable main content */}
          <Box 
            flex="1" 
            overflowY="auto" 
            p={8}
            css={{
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#c1c1c1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#a8a8a8',
              },
            }}
          >
            {stepsComponents[step]}
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  );
}

export default App;
