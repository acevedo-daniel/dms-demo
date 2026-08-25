"use client";

import { useState, useEffect } from "react";
import { gsap } from "gsap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function ConfiguracionPage() {
  const [currentEmail, setCurrentEmail] = useState("demo@example.com");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      ".config-header",
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    gsap.fromTo(
      ".config-card",
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.2,
        ease: "power3.out",
      }
    );
  }, []);

  const handleEmailChange = () => {
    if (newEmail && confirmEmail && newEmail === confirmEmail) {
      console.log("Changing email from", currentEmail, "to", newEmail);
      setCurrentEmail(newEmail);
      setNewEmail("");
      setConfirmEmail("");
      alert("Email actualizado correctamente");
    } else {
      alert("Los emails no coinciden o están vacíos");
    }
  };

  const handlePasswordChange = async () => {
    if (
      currentPassword &&
      newPassword &&
      confirmPassword &&
      newPassword === confirmPassword
    ) {
      try {
        const response = await fetch("/api/auth/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          alert("Contraseña actualizada correctamente");
        } else {
          alert(data.error || "Error al actualizar la contraseña");
        }
      } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        alert("Error al actualizar la contraseña");
      }
    } else {
      alert(
        "Verifica que todos los campos estén completos y las contraseñas coincidan"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="config-header">
        <h1 className="text-3xl font-bold text-primary">Configuración</h1>
        <p className="text-primary/70 mt-1">
          Gestiona tu cuenta y configuración del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       

        {/* Password Configuration */}
        <Card className="config-card">
          <CardHeader>
            <CardTitle className="text-primary flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Cambiar Contraseña
            </CardTitle>
            <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Contraseña actual"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-primary/50" />
                  ) : (
                    <Eye className="h-4 w-4 text-primary/50" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-primary/50" />
                  ) : (
                    <Eye className="h-4 w-4 text-primary/50" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password">Repetir Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetir nueva contraseña"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-primary/50" />
                  ) : (
                    <Eye className="h-4 w-4 text-primary/50" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              onClick={handlePasswordChange}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword
              }
            >
              Actualizar Contraseña
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Settings */}
    </div>
  );
}
