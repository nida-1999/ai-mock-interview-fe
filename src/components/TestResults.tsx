
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Play } from 'lucide-react';

interface TestCase {
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
}

interface TestResultsProps {
  testResults: TestCase[];
  isRunning: boolean;
}

const TestResults = ({ testResults, isRunning }: TestResultsProps) => {
  const passedTests = testResults.filter(test => test.passed).length;
  const totalTests = testResults.length;

  return (
    <div className="h-full bg-slate-900">
      <div className="border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Test Results</h3>
        {totalTests > 0 && (
          <Badge 
            className={passedTests === totalTests ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
          >
            {passedTests}/{totalTests} Passed
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="p-4">
          {isRunning ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Clock className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
                <p className="text-slate-400">Running test cases...</p>
              </div>
            </div>
          ) : testResults.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Play className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-400">Click "Run Code" to see test results</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {testResults.map((test, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    test.passed 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : 'border-red-500/30 bg-red-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {test.passed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="font-medium">Test Case {index + 1}</span>
                    </div>
                    <Badge variant={test.passed ? "default" : "destructive"}>
                      {test.passed ? "PASS" : "FAIL"}
                    </Badge>
                  </div>

                  <div className="space-y-2 font-mono text-sm">
                    <div>
                      <span className="text-slate-400">Input:</span>
                      <div className="bg-slate-800 rounded p-2 mt-1 text-blue-400">
                        {test.input}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400">Expected:</span>
                      <div className="bg-slate-800 rounded p-2 mt-1 text-green-400">
                        {test.expectedOutput}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400">Your Output:</span>
                      <div className={`bg-slate-800 rounded p-2 mt-1 ${
                        test.passed ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {test.actualOutput || 'No output'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Runtime and Memory Stats */}
              <div className="border-t border-slate-700 pt-4 mt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-800 rounded-lg p-3">
                    <div className="text-slate-400">Runtime</div>
                    <div className="text-green-400 font-mono">76 ms</div>
                    <div className="text-slate-500 text-xs">Beats 85.2% of users</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3">
                    <div className="text-slate-400">Memory</div>
                    <div className="text-blue-400 font-mono">44.1 MB</div>
                    <div className="text-slate-500 text-xs">Beats 92.1% of users</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TestResults;
