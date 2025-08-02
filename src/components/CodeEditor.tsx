import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, Copy, RotateCcw } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

const CodeEditor = ({ code, onChange, language, onLanguageChange }: CodeEditorProps) => {
  const [fontSize, setFontSize] = useState('14');

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'kotlin', label: 'Kotlin' },
  ];

  const fontSizes = [
    { value: '12', label: '12px' },
    { value: '14', label: '14px' },
    { value: '16', label: '16px' },
    { value: '18', label: '18px' },
  ];

  const handleReset = () => {
    const templates = {
      javascript: `function twoSum(nums, target) {
    // Write your solution here
    
}`,
      python: `def twoSum(self, nums, target):
    # Write your solution here
    pass`,
      java: `public int[] twoSum(int[] nums, int target) {
    // Write your solution here
    
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    
}`,
      csharp: `public int[] TwoSum(int[] nums, int target) {
    // Write your solution here
    
}`,
      kotlin: `fun twoSum(nums: IntArray, target: Int): IntArray {
    // Write your solution here
    
}`
    };
    onChange(templates[language as keyof typeof templates] || templates.javascript);
  };

  return (
    <div className="h-full bg-slate-900 flex flex-col">
      {/* Editor Header */}
      <div className="border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value} className="text-white hover:bg-slate-700">
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger className="w-20 bg-slate-800 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {fontSizes.map((size) => (
                <SelectItem key={size.value} value={size.value} className="text-white hover:bg-slate-700">
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" variant="ghost">
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button size="sm" variant="ghost">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-slate-900 text-white font-mono resize-none outline-none border-none pl-14 pr-4 py-4"
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
          placeholder="Start coding your solution here..."
          spellCheck={false}
        />
        
        {/* Line numbers overlay (simplified) */}
        <div className="absolute left-0 top-0 w-12 h-full bg-slate-800 border-r border-slate-700 pointer-events-none">
          <div className="p-4 font-mono text-slate-500 text-right" style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}>
            {code.split('\n').map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
