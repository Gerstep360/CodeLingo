import { accountStorage } from './account/accountStorage';

import { AccountScreen, SyncNotice } from './account/AccountScreen';
import { AdminPanel } from './admin/AdminPanel';
import { useAccount } from './account/AccountContext';

import React, { useState, useCallback, useEffect } from 'react';

import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { CustomCodeModal } from './components/CustomCodeModal';

import { ExamSummaryModal } from './components/ExamSummaryModal';

import { DuoSidebar } from './components/duo/DuoSidebar';

import { DuoRightRail } from './components/duo/DuoRightRail';

import { DuoLearningPath } from './components/duo/DuoLearningPath';

import { DuoClassPage } from './components/duo/DuoClassPage';

import { DuoLessonPage } from './components/duo/DuoLessonPage';

import LearningHub from './components/training/LearningHub';

import { DuoFlashQuiz } from './components/duo/DuoFlashQuiz';

import { DuoCheatsheet } from './components/duo/DuoCheatsheet';

import { DuoExamMode } from './components/duo/DuoExamMode';

import { DUO_UNITS } from './data/duoLessonsData';

import { duoStorage } from './utils/duoStorage';

import { useTimer } from './hooks/useTimer';

import { useTypingEngine } from './hooks/useTypingEngine';

import { useTheme } from './hooks/useTheme';

import { DEFAULT_SNIPPETS } from './utils/defaultSnippets';



export function App() {

  // Theme state ('dark' | 'light')

  const { theme, toggleTheme, isDark } = useTheme();



  const location = useLocation();

  const navigate = useNavigate();



  // Determine active tab from URL

  let activeTab = 'path';

  if (location.pathname.startsWith('/account')) activeTab = 'account';
  else if (location.pathname.startsWith('/admin')) activeTab = 'admin';

  else if (location.pathname.startsWith('/practice')) activeTab = 'practice';

  else if (location.pathname.startsWith('/flash')) activeTab = 'flash';

  else if (location.pathname.startsWith('/cheatsheet')) activeTab = 'cheatsheet';

  else if (location.pathname.startsWith('/editor')) activeTab = 'editor';

  else if (location.pathname.startsWith('/class')) activeTab = 'path';

  else if (location.pathname.startsWith('/lesson')) activeTab = 'path';



  const handleSelectTab = (tab) => {

    navigate(`/${tab}`);

  };

  const { user } = useAccount() || {};



  // Duolingo Gamification Persistent States

  const [completedNodes, setCompletedNodes] = useState(() => duoStorage.getCompletedNodes());

  const [duoStreak, setDuoStreak] = useState(() => duoStorage.getStreak());

  const [totalXp, setTotalXp] = useState(() => duoStorage.getTotalXp());

  const [dailyXp, setDailyXp] = useState(() => duoStorage.getDailyXp());



  // Editor states

  const [snippets, setSnippets] = useState(() => { try { return [...JSON.parse(accountStorage.getItem('vargas_duo_custom_snippets') || '[]'), ...DEFAULT_SNIPPETS]; } catch { return DEFAULT_SNIPPETS; } });

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

    handleFirstKey,

    currentSnippetId

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

    setSnippets((prev) => { const next = [newSnippet, ...prev]; accountStorage.setItem('vargas_duo_custom_snippets', JSON.stringify(next.filter(s => !DEFAULT_SNIPPETS.some(d => d.id === s.id)))); return next; });

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

  const activeNodeId = nextUncompletedNode ? nextUncompletedNode.id : (allDuoNodes[allDuoNodes.length - 1]?.id || 'node-sumandos-base');



  const isLessonRoute = location.pathname.startsWith('/lesson');

  const activeLesson = duoStorage.getActiveLesson();



  return (

    <div className={`duo-app-wrapper ${isLessonRoute ? 'lesson-mode-active' : ''}`}>

      {/* 1. Duolingo Left Navigation Sidebar (Hidden in focused lesson mode) */}

      {!isLessonRoute && (

        <DuoSidebar

          activeTab={activeTab}

          onSelectTab={handleSelectTab}

          streak={duoStreak}

          totalXp={totalXp}

          theme={theme}

          onToggleTheme={toggleTheme}

          isAdmin={user?.is_admin}

        />

      )}



      {/* 2. Main Content Area */}

      <div className={isLessonRoute ? 'duo-lesson-viewport-full' : 'duo-main-viewport'}>

        <SyncNotice /><Routes>

          <Route path="/account" element={<AccountScreen />} />
          <Route path="/admin" element={user?.is_admin ? <AdminPanel currentUser={user} /> : <Navigate to="/path" replace />} />

          {/* Root redirect: if there's an ongoing active lesson in storage, resume it! */}

          <Route

            path="/"

            element={

              <Navigate

                to={activeLesson?.nodeId ? `/lesson/${activeLesson.nodeId}` : '/path'}

                replace

              />

            }

          />



          {/* Learning Path (7 Clases del Primer Parcial) */}

          <Route

            path="/path"

            element={

              <div className="duo-center-scrollable">

                <DuoLearningPath

                  completedNodeIds={completedNodes}

                  activeNodeId={activeNodeId}

                  onStartLesson={(node) => navigate(`/lesson/${node.id}`)}

                  onOpenClass={(classId) => navigate(`/class/${classId}`)}

                />

              </div>

            }

          />



          {/* Dedicated Individual Class Page (/class/:classId) */}

          <Route

            path="/class/:classId"

            element={<DuoClassPage completedNodeIds={completedNodes} />}

          />



          {/* Dedicated Fullscreen Interactive Lesson Page (/lesson/:nodeId) */}

          <Route

            path="/lesson/:nodeId"

            element={<DuoLessonPage onFinishLesson={handleFinishLesson} />}

          />



          {/* Learning Hub (Práctica y Refuerzo) */}

          <Route

            path="/practice"

            element={

              <div className="duo-center-scrollable">

                <LearningHub

                  completedNodes={completedNodes}

                  onEarnXp={handleQuizComplete}

                />

              </div>

            }

          />



          {/* Flash Quiz */}

          <Route

            path="/flash"

            element={

              <div className="duo-center-scrollable">

                <DuoFlashQuiz onCompleteQuiz={handleQuizComplete} />

              </div>

            }

          />



          {/* Cheatsheet (Guía Mental de Vargas) */}

          <Route

            path="/cheatsheet"

            element={

              <div className="duo-center-scrollable">

                <DuoCheatsheet />

              </div>

            }

          />



          {/* Exam Simulator & Java IDE */}

          <Route

            path="/editor"

            element={

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

            }

          />



          {/* Fallback */}

          <Route path="*" element={<Navigate to="/path" replace />} />

        </Routes>

      </div>



      {/* 3. Duolingo Right Rail (Visible on learning, class, quiz and cheatsheet tabs) */}

      {!isLessonRoute && activeTab !== 'editor' && activeTab !== 'account' && activeTab !== 'admin' && (

        <DuoRightRail

          streak={duoStreak}

          dailyXp={dailyXp}

          targetXp={50}

          onOpenCheatsheet={() => navigate('/cheatsheet')}

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

          background: var(--bg-main);

        }



        .duo-main-viewport {

          flex: 1;

          display: flex;

          flex-direction: column;

          min-width: 0;

          background: var(--bg-main);

        }



        .duo-lesson-viewport-full {

          flex: 1;

          display: flex;

          flex-direction: column;

          min-width: 0;

          width: 100%;

          min-height: 100vh;

          background: var(--bg-main);

        }



        .duo-center-scrollable {

          flex: 1;

          overflow-y: auto;

          background: var(--bg-main);

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



        @media (max-width: 768px) {

          .duo-app-wrapper:not(.lesson-mode-active) {

            flex-direction: column;

          }



          .duo-center-scrollable {

            padding-bottom: 74px; /* clearance for mobile bottom nav */

          }



          .duo-main-viewport {

            min-height: calc(100vh - 54px);

          }

        }

      `}</style>

    </div>

  );

}



export default App;

