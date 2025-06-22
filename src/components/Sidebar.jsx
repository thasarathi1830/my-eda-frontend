import React from "react";
import { VStack, Button, Box } from "@chakra-ui/react";

const steps = [
  "Upload",
  "Overview",
  "Cleaning",
  "Outliers",
  "Visualization",
  "Report"
];

const Sidebar = ({ currentStep, setStep }) => (
  <Box
    w="256px"
    minW="256px"
    bg="gray.100"
    minH="100vh"
    py={8}
    px={2}
    borderRight="1px solid #e2e8f0"
    position="fixed"
    left={0}
    top={0}
    zIndex={100}
  >
    <VStack align="stretch" spacing={2}>
      {steps.map((label, idx) => (
        <Button
          key={label}
          variant={currentStep === idx ? "solid" : "ghost"}
          colorScheme={currentStep === idx ? "blue" : "gray"}
          onClick={() => {
            // Only allow navigation to current or previous steps
            if (idx <= currentStep) setStep(idx);
          }}
          w="100%"
          size="lg"
          fontWeight={currentStep === idx ? "bold" : "normal"}
          justifyContent="flex-start"
        >
          {label}
        </Button>
      ))}
    </VStack>
  </Box>
);

export default Sidebar;
