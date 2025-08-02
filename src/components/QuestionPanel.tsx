
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';

interface QuestionData {
  questionId: number;
  questionTitle: string;
  questionDescription: string;
  constraints: string[];
  example: {
    input: string;
    output: string;
  };
  hints: string[];
  tags: string[];
  difficulty: string;
}

interface QuestionPanelProps {
  questionData: QuestionData;
}

const QuestionPanel = ({ questionData }: QuestionPanelProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="h-full bg-slate-800">
      <div className="border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">{questionData.questionId}. {questionData.questionTitle}</h2>
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500">1.2k</span>
            <ThumbsDown className="w-4 h-4 text-red-500 ml-2" />
            <span className="text-sm text-red-500">234</span>
            <Star className="w-4 h-4 text-yellow-500 ml-2" />
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={getDifficultyColor(questionData.difficulty)}>{questionData.difficulty}</Badge>
          {questionData.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">{tag}</Badge>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-100px)]">
        <div className="px-6 py-4 space-y-6">
          <div>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {questionData.questionDescription}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Example:</h3>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
              <div className="text-slate-400">Input:</div>
              <div className="text-blue-400">{questionData.example.input}</div>
              <div className="text-slate-400 mt-2">Output:</div>
              <div className="text-green-400">{questionData.example.output}</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Constraints:</h3>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              {questionData.constraints.map((constraint, index) => (
                <li key={index}><code className="bg-slate-700 px-2 py-1 rounded text-blue-400">{constraint}</code></li>
              ))}
            </ul>
          </div>

          {questionData.hints.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Hints:</h3>
              <ul className="text-slate-300 space-y-2 list-decimal list-inside">
                {questionData.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default QuestionPanel;
