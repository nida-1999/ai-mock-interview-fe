"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import QuestionPanel from "../components/QuestionPanel";
import VideoInterview from "../components/VideoInterview";
import AudioInterview from "../components/AudioInterview";
import CodeEditor from "../components/CodeEditor";
import TestResults from "../components/TestResults";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";
import { fetchQuestion } from "../../services/questionService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface TestCase {
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
}

const Index = () => {
  const [code, setCode] = useState(`function twoSum(nums, target) {
    // Write your solution here
    
}`);
  const [queryClient] = useState(() => new QueryClient());

  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState("javascript");

  // Fetch question data using React Query
  const {
    data: questionData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["question", 1], // You can make this dynamic based on route params
    queryFn: () => fetchQuestion(),
  });

  const handleRunCode = () => {
    setIsRunning(true);

    // Simulate code execution
    setTimeout(() => {
      const mockResults: TestCase[] = [
        {
          input: "nums = [2,7,11,15], target = 9",
          expectedOutput: "[0,1]",
          actualOutput: "[0,1]",
          passed: true,
        },
        {
          input: "nums = [3,2,4], target = 6",
          expectedOutput: "[1,2]",
          actualOutput: "[1,2]",
          passed: true,
        },
        {
          input: "nums = [3,3], target = 6",
          expectedOutput: "[0,1]",
          actualOutput: "[0,1]",
          passed: true,
        },
      ];
      setTestResults(mockResults);
      setIsRunning(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading question</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!questionData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-400">CodePractice</h1>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleRunCode}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Code
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Question & Video */}
        <div className="w-1/2 border-r border-slate-700 flex flex-col">
          {/* Question Panel */}
          <div className="flex-1 overflow-hidden">
            <QuestionPanel questionData={questionData} />
          </div>

          {/* Video Interview Section */}
          <div className="h-64 border-t border-slate-700">
            <VideoInterview />
            {/* <AudioInterview /> */}
          </div>
        </div>

        {/* Right Panel - Code Editor & Results */}
        <div className="w-1/2 flex flex-col">
          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
            />
          </div>

          {/* Test Results */}
          <div className="h-64 border-t border-slate-700">
            <TestResults testResults={testResults} isRunning={isRunning} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
