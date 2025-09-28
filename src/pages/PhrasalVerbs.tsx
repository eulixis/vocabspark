import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { incrementPhrasalVerbsLearned } from "@/utils/updateUserProgress";
import { useDailyLimits } from "@/hooks/useDailyLimits";
import PhrasalVerbSection from "@/components/PhrasalVerbSection";

const PhrasalVerbs = () => {
  const { user } = useAuth();
  const { getPhrasalVerbLimits, incrementPhrasalVerbUsage, getPlanName, userPlan } = useDailyLimits();
  const [learnedVerbs, setLearnedVerbs] = useState(new Map<string, Set<number>>());

  // Phrasal verbs with cumulative counts based on plan tiers:
  // Free: 5 verbs (Easy)
  // Basic: 25 additional verbs (Intermediate) = 30 total - 5 previous
  // Medium: 30 additional verbs (Hard) = 60 total - 30 previous  
  // Pro: 40 additional verbs (UltraHard) = 100 total - 60 previous
  
  const phrasalVerbsData = {
    Easy: [
      { verb: "Give up", meaning: "Rendirse, abandonar", examples: [{ sentence: "Don't give up on your dreams.", translation: "No te rindas con tus sueños.", context: "Motivation" }], level: "Easy", category: "Essential" },
      { verb: "Turn on", meaning: "Encender", examples: [{ sentence: "Please turn on the lights.", translation: "Por favor enciende las luces.", context: "Daily life" }], level: "Easy", category: "Essential" },
      { verb: "Turn off", meaning: "Apagar", examples: [{ sentence: "Turn off your phone.", translation: "Apaga tu teléfono.", context: "Daily life" }], level: "Easy", category: "Essential" },
      { verb: "Look for", meaning: "Buscar", examples: [{ sentence: "I'm looking for my keys.", translation: "Estoy buscando mis llaves.", context: "Daily life" }], level: "Easy", category: "Essential" },
      { verb: "Come back", meaning: "Regresar, volver", examples: [{ sentence: "What time will you come back?", translation: "¿A qué hora vas a regresar?", context: "Daily life" }], level: "Easy", category: "Essential" }
    ],
    Intermediate: [
      { verb: "Put up with", meaning: "Tolerar, soportar", examples: [{ sentence: "I can't put up with this noise.", translation: "No puedo soportar este ruido.", context: "Complaints" }], level: "Intermediate", category: "Common" },
      { verb: "Run out of", meaning: "Quedarse sin", examples: [{ sentence: "We ran out of milk.", translation: "Se nos acabó la leche.", context: "Shopping" }], level: "Intermediate", category: "Common" },
      { verb: "Get along", meaning: "Llevarse bien", examples: [{ sentence: "They get along very well.", translation: "Se llevan muy bien.", context: "Relationships" }], level: "Intermediate", category: "Common" },
      { verb: "Break down", meaning: "Descomponerse, averiarse", examples: [{ sentence: "My car broke down yesterday.", translation: "Mi carro se descompuso ayer.", context: "Problems" }], level: "Intermediate", category: "Common" },
      { verb: "Show up", meaning: "Aparecer, presentarse", examples: [{ sentence: "He didn't show up to the meeting.", translation: "No se presentó a la reunión.", context: "Work" }], level: "Intermediate", category: "Common" },
      { verb: "Bring up", meaning: "Mencionar, sacar a relucir", examples: [{ sentence: "Don't bring up that topic.", translation: "No saques ese tema.", context: "Conversation" }], level: "Intermediate", category: "Common" },
      { verb: "Call off", meaning: "Cancelar", examples: [{ sentence: "They called off the meeting.", translation: "Cancelaron la reunión.", context: "Work" }], level: "Intermediate", category: "Common" },
      { verb: "Take off", meaning: "Despegar, quitarse", examples: [{ sentence: "The plane took off on time.", translation: "El avión despegó a tiempo.", context: "Travel" }], level: "Intermediate", category: "Common" },
      { verb: "Pick up", meaning: "Recoger", examples: [{ sentence: "Can you pick me up at 5?", translation: "¿Puedes recogerme a las 5?", context: "Transportation" }], level: "Intermediate", category: "Common" },
      { verb: "Drop off", meaning: "Dejar (a alguien)", examples: [{ sentence: "I'll drop you off at school.", translation: "Te dejaré en la escuela.", context: "Transportation" }], level: "Intermediate", category: "Common" },
      { verb: "Work out", meaning: "Ejercitarse, resolver", examples: [{ sentence: "I work out every morning.", translation: "Hago ejercicio cada mañana.", context: "Health" }], level: "Intermediate", category: "Common" },
      { verb: "Figure out", meaning: "Resolver, entender", examples: [{ sentence: "I need to figure out this problem.", translation: "Necesito resolver este problema.", context: "Problem solving" }], level: "Intermediate", category: "Common" },
      { verb: "Set up", meaning: "Establecer, organizar", examples: [{ sentence: "Let's set up a meeting.", translation: "Organicemos una reunión.", context: "Work" }], level: "Intermediate", category: "Common" },
      { verb: "Clean up", meaning: "Limpiar", examples: [{ sentence: "Please clean up your room.", translation: "Por favor limpia tu cuarto.", context: "Household" }], level: "Intermediate", category: "Common" },
      { verb: "Hang up", meaning: "Colgar (teléfono)", examples: [{ sentence: "Don't hang up, please.", translation: "No cuelgues, por favor.", context: "Phone calls" }], level: "Intermediate", category: "Common" },
      { verb: "Catch up", meaning: "Ponerse al día", examples: [{ sentence: "Let's catch up over coffee.", translation: "Pongámonos al día tomando café.", context: "Social" }], level: "Intermediate", category: "Common" },
      { verb: "Throw away", meaning: "Tirar, botar", examples: [{ sentence: "Don't throw away that paper.", translation: "No tires ese papel.", context: "Household" }], level: "Intermediate", category: "Common" },
      { verb: "Look up", meaning: "Buscar (información)", examples: [{ sentence: "Look up that word in the dictionary.", translation: "Busca esa palabra en el diccionario.", context: "Learning" }], level: "Intermediate", category: "Common" },
      { verb: "Put on", meaning: "Ponerse (ropa)", examples: [{ sentence: "Put on your jacket.", translation: "Ponte tu chaqueta.", context: "Clothing" }], level: "Intermediate", category: "Common" },
      { verb: "Take out", meaning: "Sacar", examples: [{ sentence: "Take out the trash, please.", translation: "Saca la basura, por favor.", context: "Household" }], level: "Intermediate", category: "Common" },
      { verb: "Go over", meaning: "Revisar", examples: [{ sentence: "Let's go over the plan again.", translation: "Revisemos el plan otra vez.", context: "Work" }], level: "Intermediate", category: "Common" },
      { verb: "Turn down", meaning: "Rechazar, bajar (volumen)", examples: [{ sentence: "He turned down the job offer.", translation: "Rechazó la oferta de trabajo.", context: "Work" }], level: "Intermediate", category: "Common" },
      { verb: "Look after", meaning: "Cuidar", examples: [{ sentence: "Can you look after my cat?", translation: "¿Puedes cuidar mi gato?", context: "Favors" }], level: "Intermediate", category: "Common" },
      { verb: "Come up", meaning: "Surgir, aparecer", examples: [{ sentence: "Something came up at work.", translation: "Surgió algo en el trabajo.", context: "Unexpected events" }], level: "Intermediate", category: "Common" },
      { verb: "Get over", meaning: "Superar", examples: [{ sentence: "It took time to get over the loss.", translation: "Tomó tiempo superar la pérdida.", context: "Emotions" }], level: "Intermediate", category: "Common" }
    ],
    Hard: [
      { verb: "Come across", meaning: "Encontrarse con, toparse con", examples: [{ sentence: "I came across an old friend yesterday.", translation: "Me topé con un viejo amigo ayer.", context: "Encounters" }], level: "Hard", category: "Advanced" },
      { verb: "Bring about", meaning: "Provocar, causar", examples: [{ sentence: "The new policy brought about many changes.", translation: "La nueva política provocó muchos cambios.", context: "Consequences" }], level: "Hard", category: "Advanced" },
      { verb: "Carry out", meaning: "Llevar a cabo, realizar", examples: [{ sentence: "They carried out the experiment successfully.", translation: "Llevaron a cabo el experimento exitosamente.", context: "Tasks" }], level: "Hard", category: "Advanced" },
      { verb: "Look into", meaning: "Investigar", examples: [{ sentence: "The police will look into the matter.", translation: "La policía investigará el asunto.", context: "Investigation" }], level: "Hard", category: "Advanced" },
      { verb: "Take after", meaning: "Parecerse a", examples: [{ sentence: "She takes after her mother.", translation: "Se parece a su madre.", context: "Family resemblance" }], level: "Hard", category: "Advanced" },
      { verb: "Run into", meaning: "Toparse con", examples: [{ sentence: "I ran into my teacher at the mall.", translation: "Me topé con mi profesor en el centro comercial.", context: "Encounters" }], level: "Hard", category: "Advanced" },
      { verb: "Put off", meaning: "Posponer", examples: [{ sentence: "Don't put off your homework.", translation: "No pospongas tu tarea.", context: "Procrastination" }], level: "Hard", category: "Advanced" },
      { verb: "Get through", meaning: "Superar, pasar por", examples: [{ sentence: "We need to get through this difficult time.", translation: "Necesitamos superar este momento difícil.", context: "Challenges" }], level: "Hard", category: "Advanced" },
      { verb: "Stand out", meaning: "Destacar", examples: [{ sentence: "Her talent makes her stand out.", translation: "Su talento la hace destacar.", context: "Excellence" }], level: "Hard", category: "Advanced" },
      { verb: "Back down", meaning: "Retroceder, ceder", examples: [{ sentence: "He refused to back down from his position.", translation: "Se negó a retroceder de su posición.", context: "Confrontation" }], level: "Hard", category: "Advanced" },
      { verb: "Count on", meaning: "Contar con", examples: [{ sentence: "You can count on me for help.", translation: "Puedes contar conmigo para ayuda.", context: "Support" }], level: "Hard", category: "Advanced" },
      { verb: "Fill in", meaning: "Rellenar, sustituir", examples: [{ sentence: "Please fill in this form.", translation: "Por favor rellena este formulario.", context: "Documentation" }], level: "Hard", category: "Advanced" },
      { verb: "Give in", meaning: "Ceder, rendirse", examples: [{ sentence: "Don't give in to pressure.", translation: "No cedas a la presión.", context: "Resistance" }], level: "Hard", category: "Advanced" },
      { verb: "Hold on", meaning: "Esperar, aguantar", examples: [{ sentence: "Hold on, I'll be right back.", translation: "Espera, ya regreso.", context: "Waiting" }], level: "Hard", category: "Advanced" },
      { verb: "Keep up", meaning: "Mantener el ritmo", examples: [{ sentence: "Try to keep up with the class.", translation: "Trata de mantener el ritmo de la clase.", context: "Performance" }], level: "Hard", category: "Advanced" },
      { verb: "Let down", meaning: "Decepcionar", examples: [{ sentence: "I don't want to let you down.", translation: "No quiero decepcionarte.", context: "Disappointment" }], level: "Hard", category: "Advanced" },
      { verb: "Make up", meaning: "Inventar, reconciliarse", examples: [{ sentence: "They made up after the fight.", translation: "Se reconciliaron después de la pelea.", context: "Reconciliation" }], level: "Hard", category: "Advanced" },
      { verb: "Pass away", meaning: "Fallecer", examples: [{ sentence: "His grandfather passed away last year.", translation: "Su abuelo falleció el año pasado.", context: "Death" }], level: "Hard", category: "Advanced" },
      { verb: "Point out", meaning: "Señalar, indicar", examples: [{ sentence: "Let me point out the main issues.", translation: "Permíteme señalar los problemas principales.", context: "Clarification" }], level: "Hard", category: "Advanced" },
      { verb: "Rule out", meaning: "Descartar", examples: [{ sentence: "We can't rule out that possibility.", translation: "No podemos descartar esa posibilidad.", context: "Possibilities" }], level: "Hard", category: "Advanced" },
      { verb: "Sort out", meaning: "Resolver, organizar", examples: [{ sentence: "We need to sort out this problem.", translation: "Necesitamos resolver este problema.", context: "Problem solving" }], level: "Hard", category: "Advanced" },
      { verb: "Think over", meaning: "Reflexionar, considerar", examples: [{ sentence: "Think it over before deciding.", translation: "Reflexiona antes de decidir.", context: "Decision making" }], level: "Hard", category: "Advanced" },
      { verb: "Turn up", meaning: "Aparecer, subir (volumen)", examples: [{ sentence: "He turned up unexpectedly.", translation: "Apareció inesperadamente.", context: "Appearances" }], level: "Hard", category: "Advanced" },
      { verb: "Wear out", meaning: "Desgastar, agotar", examples: [{ sentence: "These shoes are worn out.", translation: "Estos zapatos están desgastados.", context: "Condition" }], level: "Hard", category: "Advanced" },
      { verb: "Wind up", meaning: "Terminar, acabar", examples: [{ sentence: "We wound up staying all night.", translation: "Terminamos quedándonos toda la noche.", context: "Outcomes" }], level: "Hard", category: "Advanced" },
      { verb: "Write off", meaning: "Dar por perdido", examples: [{ sentence: "Don't write him off yet.", translation: "No lo des por perdido todavía.", context: "Dismissal" }], level: "Hard", category: "Advanced" },
      { verb: "Zero in", meaning: "Enfocarse en", examples: [{ sentence: "Let's zero in on the main problem.", translation: "Enfoquémonos en el problema principal.", context: "Focus" }], level: "Hard", category: "Advanced" },
      { verb: "Add up", meaning: "Sumar, tener sentido", examples: [{ sentence: "These numbers don't add up.", translation: "Estos números no cuadran.", context: "Logic" }], level: "Hard", category: "Advanced" },
      { verb: "Bear with", meaning: "Tener paciencia con", examples: [{ sentence: "Please bear with me while I explain.", translation: "Por favor ten paciencia mientras explico.", context: "Patience" }], level: "Hard", category: "Advanced" },
      { verb: "Come down", meaning: "Bajar, reducirse", examples: [{ sentence: "Prices came down after the sale.", translation: "Los precios bajaron después de la venta.", context: "Economics" }], level: "Hard", category: "Advanced" }
    ],
    UltraHard: [
      { verb: "Bear up under", meaning: "Soportar, resistir", examples: [{ sentence: "She bore up well under the pressure.", translation: "Resistió bien la presión.", context: "Endurance" }], level: "UltraHard", category: "Expert" },
      { verb: "Brush up on", meaning: "Repasar, refrescar conocimientos", examples: [{ sentence: "I need to brush up on my Spanish.", translation: "Necesito repasar mi español.", context: "Learning" }], level: "UltraHard", category: "Expert" },
      { verb: "Check up on", meaning: "Verificar, controlar", examples: [{ sentence: "The teacher checked up on her students.", translation: "La maestra verificó a sus estudiantes.", context: "Supervision" }], level: "UltraHard", category: "Expert" },
      { verb: "Cut down on", meaning: "Reducir", examples: [{ sentence: "I need to cut down on sugar.", translation: "Necesito reducir el azúcar.", context: "Health" }], level: "UltraHard", category: "Expert" },
      { verb: "Do away with", meaning: "Eliminar, abolir", examples: [{ sentence: "They did away with the old policy.", translation: "Eliminaron la política anterior.", context: "Change" }], level: "UltraHard", category: "Expert" },
      { verb: "Fall back on", meaning: "Recurrir a", examples: [{ sentence: "We can fall back on our savings.", translation: "Podemos recurrir a nuestros ahorros.", context: "Backup plans" }], level: "UltraHard", category: "Expert" },
      { verb: "Get away with", meaning: "Salirse con la suya", examples: [{ sentence: "He won't get away with this.", translation: "No se va a salir con la suya.", context: "Consequences" }], level: "UltraHard", category: "Expert" },
      { verb: "Live up to", meaning: "Estar a la altura de", examples: [{ sentence: "The movie lived up to expectations.", translation: "La película estuvo a la altura de las expectativas.", context: "Expectations" }], level: "UltraHard", category: "Expert" },
      { verb: "Look down on", meaning: "Despreciar, menospreciar", examples: [{ sentence: "Don't look down on others.", translation: "No menosprecies a otros.", context: "Attitude" }], level: "UltraHard", category: "Expert" },
      { verb: "Make up for", meaning: "Compensar", examples: [{ sentence: "I'll make up for lost time.", translation: "Compensaré el tiempo perdido.", context: "Compensation" }], level: "UltraHard", category: "Expert" },
      { verb: "Put up to", meaning: "Incitar, persuadir", examples: [{ sentence: "Who put you up to this?", translation: "¿Quién te incitó a esto?", context: "Influence" }], level: "UltraHard", category: "Expert" },
      { verb: "Run up against", meaning: "Toparse con (obstáculos)", examples: [{ sentence: "We ran up against unexpected problems.", translation: "Nos topamos con problemas inesperados.", context: "Obstacles" }], level: "UltraHard", category: "Expert" },
      { verb: "Stand up for", meaning: "Defender", examples: [{ sentence: "Always stand up for what's right.", translation: "Siempre defiende lo que es correcto.", context: "Justice" }], level: "UltraHard", category: "Expert" },
      { verb: "Take up with", meaning: "Empezar a relacionarse con", examples: [{ sentence: "He took up with a bad crowd.", translation: "Se empezó a relacionar con malas influencias.", context: "Relationships" }], level: "UltraHard", category: "Expert" },
      { verb: "Come up with", meaning: "Idear, proponer", examples: [{ sentence: "Can you come up with a solution?", translation: "¿Puedes idear una solución?", context: "Problem solving" }], level: "UltraHard", category: "Expert" },
      { verb: "Face up to", meaning: "Enfrentar", examples: [{ sentence: "You need to face up to reality.", translation: "Necesitas enfrentar la realidad.", context: "Confrontation" }], level: "UltraHard", category: "Expert" },
      { verb: "Get back at", meaning: "Vengarse de", examples: [{ sentence: "Don't try to get back at them.", translation: "No trates de vengarte de ellos.", context: "Revenge" }], level: "UltraHard", category: "Expert" },
      { verb: "Go along with", meaning: "Estar de acuerdo con", examples: [{ sentence: "I'll go along with your plan.", translation: "Estaré de acuerdo con tu plan.", context: "Agreement" }], level: "UltraHard", category: "Expert" },
      { verb: "Keep up with", meaning: "Mantenerse al día con", examples: [{ sentence: "It's hard to keep up with technology.", translation: "Es difícil mantenerse al día con la tecnología.", context: "Progress" }], level: "UltraHard", category: "Expert" },
      { verb: "Look forward to", meaning: "Esperar con ansias", examples: [{ sentence: "I look forward to seeing you.", translation: "Espero con ansias verte.", context: "Anticipation" }], level: "UltraHard", category: "Expert" },
      { verb: "Make do with", meaning: "Arreglárselas con", examples: [{ sentence: "We'll have to make do with what we have.", translation: "Tendremos que arreglárnoslas con lo que tenemos.", context: "Resourcefulness" }], level: "UltraHard", category: "Expert" },
      { verb: "Put down to", meaning: "Atribuir a", examples: [{ sentence: "I put his success down to hard work.", translation: "Atribuyo su éxito al trabajo duro.", context: "Attribution" }], level: "UltraHard", category: "Expert" },
      { verb: "Run out on", meaning: "Abandonar", examples: [{ sentence: "He ran out on his family.", translation: "Abandonó a su familia.", context: "Abandonment" }], level: "UltraHard", category: "Expert" },
      { verb: "Set out to", meaning: "Proponerse", examples: [{ sentence: "She set out to change the world.", translation: "Se propuso cambiar el mundo.", context: "Intentions" }], level: "UltraHard", category: "Expert" },
      { verb: "Talk down to", meaning: "Hablar condescendientemente", examples: [{ sentence: "Don't talk down to me.", translation: "No me hables condescendientemente.", context: "Respect" }], level: "UltraHard", category: "Expert" },
      { verb: "Turn out to", meaning: "Resultar ser", examples: [{ sentence: "It turned out to be a great day.", translation: "Resultó ser un gran día.", context: "Outcomes" }], level: "UltraHard", category: "Expert" },
      { verb: "Watch out for", meaning: "Tener cuidado con", examples: [{ sentence: "Watch out for icy roads.", translation: "Ten cuidado con las carreteras heladas.", context: "Caution" }], level: "UltraHard", category: "Expert" },
      { verb: "Work up to", meaning: "Llegar gradualmente a", examples: [{ sentence: "Work up to running 5 miles.", translation: "Llega gradualmente a correr 5 millas.", context: "Progress" }], level: "UltraHard", category: "Expert" },
      { verb: "Come down to", meaning: "Reducirse a", examples: [{ sentence: "It comes down to personal choice.", translation: "Se reduce a una elección personal.", context: "Essentials" }], level: "UltraHard", category: "Expert" },
      { verb: "Get on with", meaning: "Continuar con", examples: [{ sentence: "Let's get on with the meeting.", translation: "Continuemos con la reunión.", context: "Progress" }], level: "UltraHard", category: "Expert" },
      { verb: "Hold up to", meaning: "Resistir comparación con", examples: [{ sentence: "This theory holds up to scrutiny.", translation: "Esta teoría resiste el escrutinio.", context: "Validity" }], level: "UltraHard", category: "Expert" },
      { verb: "Move on to", meaning: "Pasar a", examples: [{ sentence: "Let's move on to the next topic.", translation: "Pasemos al siguiente tema.", context: "Transition" }], level: "UltraHard", category: "Expert" },
      { verb: "Own up to", meaning: "Admitir, confesar", examples: [{ sentence: "He owned up to his mistake.", translation: "Admitió su error.", context: "Honesty" }], level: "UltraHard", category: "Expert" },
      { verb: "Pull through", meaning: "Recuperarse", examples: [{ sentence: "The patient pulled through the surgery.", translation: "El paciente se recuperó de la cirugía.", context: "Recovery" }], level: "UltraHard", category: "Expert" },
      { verb: "Stick to", meaning: "Apegarse a", examples: [{ sentence: "Stick to your principles.", translation: "Apégate a tus principios.", context: "Consistency" }], level: "UltraHard", category: "Expert" },
      { verb: "Take on", meaning: "Asumir, enfrentar", examples: [{ sentence: "She took on the challenge.", translation: "Asumió el desafío.", context: "Challenges" }], level: "UltraHard", category: "Expert" },
      { verb: "Wear down", meaning: "Desgastar, agotar", examples: [{ sentence: "The constant pressure wore him down.", translation: "La presión constante lo agotó.", context: "Exhaustion" }], level: "UltraHard", category: "Expert" },
      { verb: "Work on", meaning: "Trabajar en", examples: [{ sentence: "I'm working on a new project.", translation: "Estoy trabajando en un proyecto nuevo.", context: "Work" }], level: "UltraHard", category: "Expert" },
      { verb: "Zone out", meaning: "Desconectarse mentalmente", examples: [{ sentence: "I zoned out during the lecture.", translation: "Me desconecté mentalmente durante la conferencia.", context: "Attention" }], level: "UltraHard", category: "Expert" },
      { verb: "Bite off", meaning: "Morder más de lo que se puede masticar", examples: [{ sentence: "Don't bite off more than you can chew.", translation: "No muerdas más de lo que puedes masticar.", context: "Overcommitment" }], level: "UltraHard", category: "Expert" }
    ]
  };

  const getAccessibleLevels = (plan: string) => {
    switch (plan) {
      case 'free': return ['Easy'];
      case 'basic': return ['Easy', 'Intermediate'];
      case 'medium': return ['Easy', 'Intermediate', 'Hard'];
      case 'pro': return ['Easy', 'Intermediate', 'Hard', 'UltraHard'];
      default: return ['Easy'];
    }
  };

  const accessibleLevels = getAccessibleLevels(userPlan);

  const handleVerbLearned = async () => {
    const limits = getPhrasalVerbLimits();
    
    if (user) {
      const usageResult = await incrementPhrasalVerbUsage();
      if (usageResult.success) {
        await incrementPhrasalVerbsLearned(user.id);
      }
    }
  };

  const handleVerbComplete = (level: string, verbIndex: number) => {
    setLearnedVerbs(prev => {
      const newMap = new Map(prev);
      const currentSet = newMap.get(level) || new Set();
      currentSet.add(verbIndex);
      newMap.set(level, currentSet);
      return newMap;
    });
  };

  const sections = [
    { key: 'Easy', title: 'Verbos Frasales Fáciles', level: 'Easy' },
    { key: 'Intermediate', title: 'Verbos Frasales Intermedios', level: 'Intermediate' },
    { key: 'Hard', title: 'Verbos Frasales Difíciles', level: 'Hard' },
    { key: 'UltraHard', title: 'Verbos Frasales Ultra Difíciles', level: 'UltraHard' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center">
          <BookOpen className="h-8 w-8 mr-3 text-primary" />
          Verbos Frasales
        </h1>
        <p className="text-muted-foreground mb-4">
          Domina los phrasal verbs más importantes del inglés con ejemplos prácticos
        </p>

        {/* Daily Limits */}
        <Card className="mb-6 bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <p className="font-medium">Límite diario verbos</p>
                  <p className="text-muted-foreground">
                    {getPhrasalVerbLimits().phrasalVerbsLearned} / {getPhrasalVerbLimits().dailyLimit} verbos
                  </p>
                </div>
                <Progress 
                  value={(getPhrasalVerbLimits().phrasalVerbsLearned / getPhrasalVerbLimits().dailyLimit) * 100} 
                  className="w-24 h-2" 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={userPlan === 'free' ? 'secondary' : 'default'} className="text-xs">
                  Plan {getPlanName(userPlan)}
                </Badge>
                {!getPhrasalVerbLimits().canLearnMore && (
                  <Badge variant="destructive" className="text-xs">
                    Límite alcanzado
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phrasal Verb Sections */}
      <div className="space-y-6">
        {sections.map(section => (
          <PhrasalVerbSection
            key={section.key}
            title={section.title}
            level={section.level}
            phrasalVerbs={phrasalVerbsData[section.key as keyof typeof phrasalVerbsData]}
            isLocked={!accessibleLevels.includes(section.level)}
            onVerbLearned={handleVerbLearned}
            canLearnMore={getPhrasalVerbLimits().canLearnMore}
            remainingWords={getPhrasalVerbLimits().remainingVerbs}
            learnedVerbs={learnedVerbs.get(section.level) || new Set()}
            onVerbComplete={(verbIndex) => handleVerbComplete(section.level, verbIndex)}
          />
        ))}
      </div>
    </div>
  );
};

export default PhrasalVerbs;