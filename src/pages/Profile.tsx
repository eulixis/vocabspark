import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Calendar,
  Trophy,
  Target,
  BookOpen,
  Settings,
  Bell,
  Shield,
  LogOut,
  Crown,
  Edit2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    daily: true,
    progress: true,
    achievements: false,
    marketing: false
  });

  const [userInfo, setUserInfo] = useState({
    name: "María González",
    email: "maria@email.com",
    joinDate: "Enero 2024",
    currentLevel: "Intermedio",
    streak: 15,
    plan: "Medium"
  });

  const achievements = [
    { title: "Primera Palabra", description: "Aprendiste tu primera palabra", date: "Hace 2 meses", icon: BookOpen },
    { title: "Racha de 7 días", description: "Mantuviste una racha de 7 días", date: "Hace 1 semana", icon: Target },
    { title: "100 Palabras", description: "Aprendiste 100 palabras", date: "Hace 3 días", icon: Trophy },
  ];

  const learningStats = [
    { label: "Palabras Aprendidas", value: 247, icon: BookOpen, color: "text-success" },
    { label: "Días Consecutivos", value: 15, icon: Target, color: "text-warning" },
    { label: "Juegos Completados", value: 23, icon: Trophy, color: "text-accent" },
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Perfil actualizado",
      description: "Tus cambios han sido guardados correctamente.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Cerrando sesión",
      description: "Has cerrado sesión exitosamente.",
    });
    // Redirect logic would go here
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Configuración actualizada",
      description: `Notificaciones ${value ? 'activadas' : 'desactivadas'} para ${key}.`,
    });
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "Basic": return "bg-tier-basic text-white";
      case "Medium": return "bg-tier-medium text-white";
      case "Pro": return "bg-tier-pro text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <User className="h-8 w-8 mr-3 text-primary" />
            Mi Perfil
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y preferencias de aprendizaje
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card className="shadow-learning-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Información Personal
                  </CardTitle>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancelar" : "Editar"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-primary text-white">
                      MG
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-2xl font-bold">{userInfo.name}</h3>
                      <Badge className={getPlanBadgeColor(userInfo.plan)}>
                        <Crown className="h-3 w-3 mr-1" />
                        {userInfo.plan}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Miembro desde {userInfo.joinDate}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveProfile} variant="gradient">
                      Guardar Cambios
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications Settings */}
            <Card className="shadow-learning-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Configuración de Notificaciones
                </CardTitle>
                <CardDescription>
                  Personaliza qué notificaciones quieres recibir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Recordatorios diarios</Label>
                    <p className="text-sm text-muted-foreground">Recibe recordatorios para estudiar</p>
                  </div>
                  <Switch
                    checked={notifications.daily}
                    onCheckedChange={(value) => handleNotificationChange('daily', value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Progreso de aprendizaje</Label>
                    <p className="text-sm text-muted-foreground">Actualizaciones sobre tu progreso</p>
                  </div>
                  <Switch
                    checked={notifications.progress}
                    onCheckedChange={(value) => handleNotificationChange('progress', value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Logros y medallas</Label>
                    <p className="text-sm text-muted-foreground">Notificaciones de nuevos logros</p>
                  </div>
                  <Switch
                    checked={notifications.achievements}
                    onCheckedChange={(value) => handleNotificationChange('achievements', value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Marketing y ofertas</Label>
                    <p className="text-sm text-muted-foreground">Promociones y nuevas funciones</p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(value) => handleNotificationChange('marketing', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Stats */}
            <Card className="shadow-learning-sm">
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                          <stat.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{stat.label}</span>
                      </div>
                      <span className="text-2xl font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="shadow-learning-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Logros Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                      <div className="p-2 bg-warning rounded-lg">
                        <achievement.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="shadow-learning-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Cambiar Contraseña
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Verificar Email
                </Button>
                <Separator />
                <Button 
                  onClick={handleLogout}
                  variant="destructive" 
                  className="w-full justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };
};

export default Profile;