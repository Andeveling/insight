/**
 * Feedback Dashboard Page
 *
 * Main feedback page showing sent/received requests and insights
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Send,
  Inbox,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lightbulb,
  Sparkles,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DashboardContainer from "../_components/dashboard-container";
import { getSession } from "@/lib/auth";
import { getFeedbackRequests } from "./_services/feedback-request.service";
import { getInsightsStatus } from "./_services/feedback-analysis.service";
import type { FeedbackRequestStatus } from "@/generated/prisma/client";

export default async function FeedbackDashboardPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [sentRequests, receivedRequests, insightsStatus] = await Promise.all([
    getFeedbackRequests(session.user.id, "sent"),
    getFeedbackRequests(session.user.id, "received"),
    getInsightsStatus(session.user.id),
  ]);

  const pendingReceived = receivedRequests.filter(
    (r) => r.status === "PENDING"
  );
  const pendingSent = sentRequests.filter((r) => r.status === "PENDING");
  const completedSent = sentRequests.filter((r) => r.status === "COMPLETED");

  return (
    <DashboardContainer
      title="Feedback 360°"
      description="Gestiona tus solicitudes de feedback y descubre nuevas perspectivas"
      card={
        <div className="flex gap-2">
          <Link href="/dashboard/feedback/history">
            <Button variant="outline">
              <History className="h-4 w-4 mr-2" />
              Historial
            </Button>
          </Link>
          {insightsStatus.hasEnoughResponses && (
            <Link href="/dashboard/feedback/insights">
              <Button
                variant={insightsStatus.hasNewInsights ? "default" : "outline"}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Ver Insights
                {insightsStatus.hasNewInsights && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Nuevo
                  </Badge>
                )}
              </Button>
            </Link>
          )}
          <Link href="/dashboard/feedback/request">
            <Button
              variant={
                insightsStatus.hasEnoughResponses ? "outline" : "default"
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Solicitud
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending to Respond */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-primary" />
              Pendientes de Responder
            </CardTitle>
            <CardDescription>
              Solicitudes de feedback que tus compañeros te han enviado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingReceived.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No tienes solicitudes pendientes
              </p>
            ) : (
              <div className="space-y-3">
                {pendingReceived.map((request) => (
                  <FeedbackRequestCard
                    key={request.id}
                    request={request}
                    type="received"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sent Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Solicitudes Enviadas
            </CardTitle>
            <CardDescription>
              Feedback que has solicitado a tus compañeros
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sentRequests.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  No has enviado solicitudes aún
                </p>
                <Link href="/dashboard/feedback/request">
                  <Button variant="outline" size="sm">
                    Crear Primera Solicitud
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingSent.map((request) => (
                  <FeedbackRequestCard
                    key={request.id}
                    request={request}
                    type="sent"
                  />
                ))}

                {pendingSent.length > 0 && completedSent.length > 0 && (
                  <Separator className="my-4" />
                )}

                {completedSent.slice(0, 3).map((request) => (
                  <FeedbackRequestCard
                    key={request.id}
                    request={request}
                    type="sent"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-4 mt-6">
        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label="Pendientes"
          value={pendingSent.length}
          variant="warning"
        />
        <StatCard
          icon={<CheckCircle className="h-4 w-4" />}
          label="Completadas"
          value={completedSent.length}
          variant="success"
        />
        <StatCard
          icon={<Send className="h-4 w-4" />}
          label="Enviadas"
          value={sentRequests.length}
          variant="default"
        />
        <StatCard
          icon={<Inbox className="h-4 w-4" />}
          label="Por Responder"
          value={pendingReceived.length}
          variant="primary"
        />
      </div>
    </DashboardContainer>
  );
}

/**
 * Individual feedback request card
 */
interface FeedbackRequestCardProps {
  request: {
    id: string;
    status: FeedbackRequestStatus;
    isAnonymous: boolean;
    sentAt: Date;
    expiresAt: Date | null;
    respondent: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
    responseCount: number;
  };
  type: "sent" | "received";
}

function FeedbackRequestCard({ request, type }: FeedbackRequestCardProps) {
  const statusConfig = {
    PENDING: { label: "Pendiente", variant: "outline" as const, icon: Clock },
    COMPLETED: {
      label: "Completada",
      variant: "default" as const,
      icon: CheckCircle,
    },
    DECLINED: {
      label: "Rechazada",
      variant: "destructive" as const,
      icon: XCircle,
    },
    EXPIRED: {
      label: "Expirada",
      variant: "secondary" as const,
      icon: AlertCircle,
    },
  };

  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      {/* Avatar */}
      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
        {request.respondent.image ? (
          <Image
            src={request.respondent.image}
            alt={request.respondent.name}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium">
            {request.respondent.name?.charAt(0)?.toUpperCase() || "?"}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{request.respondent.name}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(request.sentAt).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
          })}
          {request.isAnonymous && " • Anónimo"}
        </p>
      </div>

      {/* Actions or Status */}
      {type === "received" && request.status === "PENDING" ? (
        <Link href={`/dashboard/feedback/respond/${request.id}`}>
          <Button size="sm">Responder</Button>
        </Link>
      ) : (
        <Badge variant={status.variant} className="flex items-center gap-1">
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </Badge>
      )}
    </div>
  );
}

/**
 * Statistics card component
 */
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  variant: "default" | "primary" | "success" | "warning";
}

function StatCard({ icon, label, value, variant }: StatCardProps) {
  const variantStyles = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-600 dark:text-green-400",
    warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${variantStyles[variant]}`}>
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
