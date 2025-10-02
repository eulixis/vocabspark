import { WordMatchGame } from "./WordMatchGame";
import { FillBlanksGame } from "./FillBlanksGame";
import { SpeedWordsGame } from "./SpeedWordsGame";
import { SentenceBuilderGame } from "./SentenceBuilderGame";
import { TranslationChallengeGame } from "./TranslationChallengeGame";
import { ListeningGame } from "./ListeningGame";

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
