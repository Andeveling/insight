/**
 * Feedback Success Page
 *
 * Página de confirmación después de enviar feedback
 */

import Link from "next/link";
import { CheckCircle2, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardContainer from "@/app/dashboard/_components/dashboard-container";

export default function FeedbackSuccessPage() {
  return (
    <DashboardContainer
      title="¡Gracias!"
      description="Tu feedback ha sido registrado"
    >
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Respuesta Enviada</CardTitle>
            <CardDescription>
              Tu feedback ayudará a tu compañero a crecer profesionalmente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Tu respuesta ha sido registrada de forma{" "}
                <strong className="text-foreground">anónima</strong>.
              </p>
              <p className="mt-2">
                Tu compañero recibirá los insights una vez que tenga suficientes
                respuestas.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/dashboard/feedback">
                <Button className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Dashboard de Feedback
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  Ir al Dashboard Principal
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardContainer>
  );
}
