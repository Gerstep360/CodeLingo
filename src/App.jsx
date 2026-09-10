import React, { useState, useCallback, useEffect } from 'react';
import { CustomCodeModal } from './components/CustomCodeModal';
import { ExamSummaryModal } from './components/ExamSummaryModal';
import { DuoSidebar } from './components/duo/DuoSidebar';
import { DuoRightRail } from './components/duo/DuoRightRail';
import { DuoLearningPath } from './components/duo/DuoLearningPath';
import { DuoLessonRunner } from './components/duo/DuoLessonRunner';
import { DuoFlashQuiz } from './components/duo/DuoFlashQuiz';
import { DuoCheatsheet } from './components/duo/DuoCheatsheet';
import { DuoExamMode } from './components/duo/DuoExamMode';
import { DUO_UNITS } from './data/duoLessonsData';
import { duoStorage } from './utils/duoStorage';
import { useTimer } from './hooks/useTimer';
import { useTypingEngine } from './hooks/useTypingEngine';
import { DEFAULT_SNIPPETS } from './utils/defaultSnippets';

export function App() {
  // Navigation tabs: 'path' | 'flash' | 'editor' | 'cheatsheet'
  const [activeTab, setActiveTab] = useState('path');

  // Duolingo Gamification Persistent States
  const [completedNodes, setCompletedNodes] = useState(() => duoStorage.getCompletedNodes());
  const [duoStreak, setDuoStreak] = useState(() => duoStorage.getStreak());
  const [totalXp, setTotalXp] = useState(() => duoStorage.getTotalXp());
  const [dailyXp, setDailyXp] = useState(() => duoStorage.getDailyXp());

  // Active interactive lesson modal runner
  const [activeLessonNode, setActiveLessonNode] = useState(null);

  // Editor states
  const [snippets, setSnippets] = useState(DEFAULT_SNIPPETS);
  const [currentSnippetId, setCurrentSnippetId] = useState(DEFAULT_SNIPPETS[0].id);
  const [isExamMode, setIsExamMode] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [activeFunctionName, setActiveFunctionName] = useState('sumandos');
  const [jumpToLineIdx, setJumpToLineIdx] = useState(null);

  // Synchronize snippets
  useEffect(() => {
    setSnippets((prev) => {
      const customOnes = prev.filter((s) => !DEFAULT_SNIPPETS.some((d) => d.id === s.id));
      return [...DEFAULT_SNIPPETS, ...customOnes];
    });
  }, []);

  const currentSnippet =
    snippets.find((s) => s.id === currentSnippetId) || snippets[0];

  const handleTimerExpire = useCallback(() => {
    setIsSummaryModalOpen(true);
  }, []);

  const timer = useTimer(45, handleTimerExpire);

  const handleFirstKey = useCallback(() => {
    if (!timer.isRunning && !timer.hasStarted) {
      timer.start();
    }
  }, [timer]);

  const engine = useTypingEngine(
    currentSnippet.code,
    isExamMode,
    () => {
      timer.pause();
      setIsSummaryModalOpen(true);
    },
    handleFirstKey
  );

  const handleReloadFile = useCallback(() => {
    const fresh = DEFAULT_SNIPPETS.find((s) => s.id === currentSnippetId) || DEFAULT_SNIPPETS[0];
    engine.resetEngine(fresh.code);
    timer.reset();
  }, [currentSnippetId, engine, timer]);

  const handleSelectSnippet = (snippetId) => {
    setCurrentSnippetId(snippetId);
    const target = snippets.find((s) => s.id === snippetId) || DEFAULT_SNIPPETS.find((s) => s.id === snippetId);
    if (target) {
      engine.resetEngine(target.code);
      timer.reset();
      setIsSummaryModalOpen(false);
    }
  };

  const handleSaveCustomCode = (newSnippet) => {
    setSnippets((prev) => [newSnippet, ...prev]);
    setCurrentSnippetId(newSnippet.id);
    engine.resetEngine(newSnippet.code);
    timer.reset();
  };

  const handleRetry = () => {
    engine.resetEngine(currentSnippet.code);
    timer.reset();
    setIsSummaryModalOpen(false);
  };

  const handleNextSnippet = () => {
    const currentIndexInList = snippets.findIndex((s) => s.id === currentSnippetId);
    const nextIndex = (currentIndexInList + 1) % snippets.length;
    const nextSnippet = snippets[nextIndex];
    handleSelectSnippet(nextSnippet.id);
  };

  const handleToggleExamMode = (examModeActive) => {
    setIsExamMode(examModeActive);
    engine.resetEngine(currentSnippet.code);
    timer.reset();
  };

  const handleSelectOutlineFunction = (fn) => {
    setActiveFunctionName(fn.name);
    setJumpToLineIdx(fn.lineIdx);
    engine.jumpToIndex(fn.startIndex);
  };

  // Duolingo lesson finish callback
  const handleFinishLesson = (nodeId, earnedXp) => {
    setCompletedNodes((prev) => {
      const next = prev.includes(nodeId) ? prev : [...prev, nodeId];
      duoStorage.saveCompletedNodes(next);
      return next;
    });

    setTotalXp((prev) => {
      const next = prev + earnedXp;
      duoStorage.saveTotalXp(next);
      return next;
    });

    setDailyXp((prev) => {
      const next = prev + earnedXp;
      duoStorage.saveDailyXp(next);
      return next;
    });
  };

  const handleQuizComplete = (earnedXp) => {
    setTotalXp((prev) => {
      const next = prev + earnedXp;
      duoStorage.saveTotalXp(next);
      return next;
    });
    setDailyXp((prev) => {
      const next = prev + earnedXp;
      duoStorage.saveDailyXp(next);
      return next;
    });
  };

  // Dynamically calculate active node in sequence across all units
  const allDuoNodes = DUO_UNITS.flatMap((u) => u.nodes);
  const nextUncompletedNode = allDuoNodes.find((n) => !completedNodes.includes(n.id));
  const activeNodeId = nextUncompletedNode ? nextUncompletedNode.id : (allDuoNodes[allDuoNodes.length - 1]?.id || 'node-1-1');

  return (
    <div className="duo-app-wrapper">
      {/* 1. Duolingo Left Navigation Sidebar */}
      <DuoSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        streak={duoStreak}
        totalXp={totalXp}
      />

      {/* 2. Main Content Area */}
      <div className="duo-main-viewport">
        {activeTab === 'path' && (
          <div className="duo-center-scrollable">
            <DuoLearningPath
              completedNodeIds={completedNodes}
              activeNodeId={activeNodeId}
              onStartLesson={(node) => setActiveLessonNode(node)}
            />
          </div>
        )}

        {activeTab === 'flash' && (
          <div className="duo-center-scrollable">
            <DuoFlashQuiz onCompleteQuiz={handleQuizComplete} />
          </div>
        )}

        {activeTab === 'cheatsheet' && (
          <div className="duo-center-scrollable">
            <DuoCheatsheet />
          </div>
        )}

        {activeTab === 'editor' && (
          <DuoExamMode
            timer={timer}
            isExamMode={isExamMode}
            onToggleExamMode={handleToggleExamMode}
            engine={engine}
            snippets={snippets}
            currentSnippetId={currentSnippetId}
            onSelectSnippet={handleSelectSnippet}
            currentSnippet={currentSnippet}
            activeFunctionName={activeFunctionName}
            onSelectOutlineFunction={handleSelectOutlineFunction}
            jumpToLineIdx={jumpToLineIdx}
            onReloadFile={handleReloadFile}
            onOpenCustomModal={() => setIsCustomModalOpen(true)}
          />
        )}
      </div>

      {/* 3. Duolingo Right Rail (Visible on learning, quiz and cheatsheet tabs) */}
      {activeTab !== 'editor' && (
        <DuoRightRail
          streak={duoStreak}
          dailyXp={dailyXp}
          targetXp={50}
          onOpenCheatsheet={() => setActiveTab('cheatsheet')}
        />
      )}

      {/* 4. Interactive Fullscreen Lesson Runner Modal */}
      {activeLessonNode && (
        <DuoLessonRunner
          node={activeLessonNode}
          onClose={() => setActiveLessonNode(null)}
          onFinishLesson={handleFinishLesson}
        />
      )}

      {/* Custom Code Modal */}
      <CustomCodeModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSaveCustomCode={handleSaveCustomCode}
      />

      {/* Post Exam Summary Modal */}
      <ExamSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        onRetry={handleRetry}
        onNext={snippets.length > 1 ? handleNextSnippet : null}
        wpm={engine.wpm}
        cpm={engine.cpm}
        accuracy={engine.accuracy}
        totalErrors={engine.totalErrors}
        maxStreak={engine.maxStreak}
        timeTakenFormatted={timer.formattedTime}
        isExamMode={isExamMode}
        snippetTitle={currentSnippet.title}
      />

      <style>{`
        .duo-app-wrapper {
          display: flex;
          min-height: 100vh;
          background: #FFFFFF;
        }

        .duo-main-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: #FFFFFF;
        }

        .duo-center-scrollable {
          flex: 1;
          overflow-y: auto;
          background: #FFFFFF;
        }

        .duo-editor-full-frame {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .duo-ide-inner-row {
          flex: 1;
          display: flex;
          min-height: 0;
        }
      `}</style>
    </div>
  );
}

export default App;
