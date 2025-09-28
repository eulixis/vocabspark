import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Gamepad2, 
  Target, 
  Clock,
  Trophy,
  RefreshCw,
  CheckCircle,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { incrementGamesCompleted } from "@/utils/updateUserProgress";

const Games = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentGame, setCurrentGame] = useState("wordMatch");
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const games = [
    {
      id: "wordMatch",
      title: "Coincidencia de Palabras",
      description: "Relaciona las palabras en inglés con su traducción",
      icon: Target,
      color: "bg-gradient-primary"
    },
    {
      id: "fillBlanks",
      title: "Completar Oraciones",
      description: "Completa las oraciones con la palabra correcta",
      icon: Trophy,
      color: "bg-gradient-secondary"
    },
    {
      id: "pronunciation",
      title: "Pronunciación",
      description: "Escucha y selecciona la palabra correcta",
      icon: Clock,
      color: "bg-gradient-primary"
    }
  ];

  const wordMatchQuestions = [
    {
      question: "Selecciona la traducción correcta de 'Achievement'",
      options: ["Logro", "Intento", "Problema", "Solución"],
      correct: "Logro"
    },
    {
      question: "¿Qué significa 'Brilliant'?",
      options: ["Oscuro", "Brillante", "Pequeño", "Grande"],
      correct: "Brillante"
    },
    {
      question: "Traducción de 'Opportunity'",
      options: ["Problema", "Oportunidad", "Dificultad", "Obstáculo"],
      correct: "Oportunidad"
    },
    {
      question: "¿Qué significa 'Fascinating'?",
      options: ["Aburrido", "Confuso", "Fascinante", "Simple"],
      correct: "Fascinante"
    },
    {
      question: "Traducción de 'Demonstrate'",
      options: ["Ocultar", "Demostrar", "Ignorar", "Confundir"],
      correct: "Demostrar"
    }
  ];

  const currentQuestionData = wordMatchQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / wordMatchQuestions.length) * 100;

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCurrentQuestion(0);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setShowResult(false);
    
    // Start timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (!showResult) {
      setShowResult(true);
      toast({
        title: "¡Tiempo agotado!",
        description: "Se acabó el tiempo para esta pregunta.",
        variant: "destructive",
      });
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === currentQuestionData.correct;
    if (isCorrect) {
      setScore(score + 10);
      toast({
        title: "¡Correcto!",
        description: "Respuesta correcta. +10 puntos",
      });
    } else {
      toast({
        title: "Incorrecto",
        description: `La respuesta correcta es: ${currentQuestionData.correct}`,
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestion < wordMatchQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      // Game completed
      setGameStarted(false);
      
      // Update user stats if user is logged in
      if (user) {
        await incrementGamesCompleted(user.id);
      }
      
      toast({
        title: "¡Juego completado!",
        description: `Puntuación final: ${score} puntos`,
      });
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setCurrentQuestion(0);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const getAnswerStyle = (option: string) => {
    if (!showResult) return "hover:bg-accent/50";
    if (option === currentQuestionData.correct) return "bg-success text-success-foreground";
    if (option === selectedAnswer && option !== currentQuestionData.correct) {
      return "bg-destructive text-destructive-foreground";
    }
    return "bg-muted";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <Gamepad2 className="h-8 w-8 mr-3 text-primary" />
            Juegos Interactivos
          </h1>
          <p className="text-muted-foreground">
            Practica tu inglés de manera divertida con estos juegos educativos
          </p>
        </div>

        {!gameStarted ? (
          <>
            {/* Game Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {games.map((game) => (
                <Card 
                  key={game.id}
                  className={`cursor-pointer hover:shadow-learning-lg transition-all duration-300 hover:-translate-y-1 ${
                    currentGame === game.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setCurrentGame(game.id)}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${game.color} flex items-center justify-center mb-3`}>
                      <game.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{game.title}</CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Start Game */}
            <div className="text-center">
              <Button
                onClick={startGame}
                variant="gradient"
                size="lg"
                className="text-xl px-8 py-4"
              >
                <Gamepad2 className="h-6 w-6 mr-2" />
                Comenzar Juego
              </Button>
            </div>
          </>
        ) : (
          <Card className="shadow-learning-lg">
            <CardHeader>
              {/* Game Stats */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-primary">
                    <Trophy className="h-5 w-5 mr-1" />
                    <span className="font-bold">{score} pts</span>
                  </div>
                  <div className="flex items-center text-warning">
                    <Clock className="h-5 w-5 mr-1" />
                    <span className="font-bold">{timeLeft}s</span>
                  </div>
                </div>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reiniciar
                </Button>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progreso</span>
                  <span className="text-sm text-muted-foreground">
                    Pregunta {currentQuestion + 1} de {wordMatchQuestions.length}
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <CardTitle className="text-xl text-center">
                {currentQuestionData.question}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {currentQuestionData.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    variant="outline"
                    className={`h-16 text-lg ${getAnswerStyle(option)}`}
                    disabled={showResult}
                  >
                    {option}
                    {showResult && option === currentQuestionData.correct && (
                      <CheckCircle className="h-5 w-5 ml-2" />
                    )}
                    {showResult && option === selectedAnswer && option !== currentQuestionData.correct && (
                      <X className="h-5 w-5 ml-2" />
                    )}
                  </Button>
                ))}
              </div>

              {/* Next Question Button */}
              {showResult && (
                <div className="text-center">
                  <Button
                    onClick={handleNextQuestion}
                    variant="gradient"
                    size="lg"
                  >
                    {currentQuestion < wordMatchQuestions.length - 1 ? 'Siguiente Pregunta' : 'Terminar Juego'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

export default Games;