import { WordMatchGame } from "./WordMatchGame";
import { FillBlanksGame } from "./FillBlanksGame";
import { SpeedWordsGame } from "./SpeedWordsGame";
import { SentenceBuilderGame } from "./SentenceBuilderGame";
import { TranslationChallengeGame } from "./TranslationChallengeGame";
import { ListeningGame } from "./ListeningGame";
import { PronunciationGame } from "./PronunciationGame";
import { ListeningCompGame } from "./ListeningCompGame";
import { WordBuilderGame } from "./WordBuilderGame";
import { ContextCluesGame } from "./ContextCluesGame";
import { PhrasalChallengeGame } from "./PhrasalChallengeGame";
import { NativeSpeedGame } from "./NativeSpeedGame";
import { IdiomsExpertGame } from "./IdiomsExpertGame";
import { BusinessEnglishGame } from "./BusinessEnglishGame";
import { MasterChallengeGame } from "./MasterChallengeGame";

interface GameWrapperProps {
  gameId: string;
  onComplete: (score: number) => void;
  onReset: () => void;
}

export const GameWrapper = ({ gameId, onComplete, onReset }: GameWrapperProps) => {
  switch (gameId) {
    case "wordMatch":
      return <WordMatchGame onComplete={onComplete} onReset={onReset} />;
    case "fillBlanks":
      return <FillBlanksGame onComplete={onComplete} onReset={onReset} />;
    case "speedWords":
      return <SpeedWordsGame onComplete={onComplete} onReset={onReset} />;
    case "sentenceBuilder":
      return <SentenceBuilderGame onComplete={onComplete} onReset={onReset} />;
    case "translationChallenge":
      return <TranslationChallengeGame onComplete={onComplete} onReset={onReset} />;
    case "listening":
      return <ListeningGame onComplete={onComplete} onReset={onReset} />;
    case "pronunciation":
      return <PronunciationGame onComplete={onComplete} onReset={onReset} />;
    case "listeningComp":
      return <ListeningCompGame onComplete={onComplete} onReset={onReset} />;
    case "wordBuilder":
      return <WordBuilderGame onComplete={onComplete} onReset={onReset} />;
    case "contextClues":
      return <ContextCluesGame onComplete={onComplete} onReset={onReset} />;
    case "phrasalChallenge":
      return <PhrasalChallengeGame onComplete={onComplete} onReset={onReset} />;
    case "nativeSpeed":
      return <NativeSpeedGame onComplete={onComplete} onReset={onReset} />;
    case "idiomsExpert":
      return <IdiomsExpertGame onComplete={onComplete} onReset={onReset} />;
    case "businessEnglish":
      return <BusinessEnglishGame onComplete={onComplete} onReset={onReset} />;
    case "masterChallenge":
      return <MasterChallengeGame onComplete={onComplete} onReset={onReset} />;
    default:
      return (
        <div className="text-center p-8">
          <p className="text-lg text-muted-foreground">
            Este juego está en desarrollo.
          </p>
        </div>
      );
  }
};
