import { WordMatchGame } from "./WordMatchGame";
import { FillBlanksGame } from "./FillBlanksGame";
import { SpeedWordsGame } from "./SpeedWordsGame";

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
    // Los demás juegos mostrarán un mensaje temporal
    default:
      return (
        <div className="text-center p-8">
          <p className="text-lg text-muted-foreground">
            Este juego está en desarrollo. Por ahora prueba los juegos disponibles.
          </p>
        </div>
      );
  }
};
