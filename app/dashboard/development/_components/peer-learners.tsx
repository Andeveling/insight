"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Users, Sparkles, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/cn";
import type { PeerLearner } from "../_actions";

interface PeerLearnersProps {
	/**
	 * List of peer learners to display
	 */
	peers: PeerLearner[];
	/**
	 * Module ID for collaborative challenge initiation
	 */
	moduleId: string;
	/**
	 * Callback when user wants to invite a peer
	 */
	onInvitePeer?: (peerId: string) => void;
	/**
	 * Whether loading state is active
	 */
	isLoading?: boolean;
	/**
	 * CSS class name
	 */
	className?: string;
}

/**
 * PeerLearners Component
 *
 * Displays a list of users working on the same learning path.
 * Shows progress, complementary strengths, and invite action.
 */
export function PeerLearners({
	peers,
	// moduleId is available for future use (e.g., filtering peers by module)
	onInvitePeer,
	isLoading = false,
	className,
}: PeerLearnersProps) {
	if (isLoading) {
		return <PeerLearnersSkeleton />;
	}

	if (peers.length === 0) {
		return (
			<Card className={cn("border-dashed", className)}>
				<CardContent className="flex flex-col items-center justify-center py-12 text-center">
					<div className="mb-4 rounded-full bg-muted p-4">
						<Users className="h-8 w-8 text-muted-foreground" />
					</div>
					<p className="text-lg font-medium text-muted-foreground">
						Aún no hay compañeros en esta ruta
					</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Cuando otros usuarios comiencen este módulo, aparecerán aquí
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Users className="h-5 w-5 text-primary" />
					Compañeros de Aprendizaje
					<Badge variant="secondary" className="ml-auto">
						{peers.length}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<AnimatePresence mode="popLayout">
					{peers.map((peer, index) => (
						<motion.div
							key={peer.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ delay: index * 0.05 }}
						>
							<PeerCard peer={peer} onInvite={() => onInvitePeer?.(peer.id)} />
						</motion.div>
					))}
				</AnimatePresence>
			</CardContent>
		</Card>
	);
}

interface PeerCardProps {
	peer: PeerLearner;
	onInvite: () => void;
}

function PeerCard({ peer, onInvite }: PeerCardProps) {
	return (
		<div className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
			{/* Avatar */}
			<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-primary/20 to-primary/40">
				{peer.image ? (
					<img
						src={peer.image}
						alt={peer.name}
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">
						{peer.name.charAt(0).toUpperCase()}
					</div>
				)}
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<p className="font-medium truncate">{peer.name}</p>
					{peer.complementaryStrengths.length > 0 && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Badge
										variant="outline"
										className="gap-1 border-amber-200 bg-amber-50 text-amber-700"
									>
										<Sparkles className="h-3 w-3" />
										Complementario
									</Badge>
								</TooltipTrigger>
								<TooltipContent>
									<p className="font-medium">Fortalezas complementarias:</p>
									<ul className="mt-1 text-xs">
										{peer.complementaryStrengths.map((strength) => (
											<li key={strength} className="capitalize">
												• {strength.replace(/-/g, " ")}
											</li>
										))}
									</ul>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</div>

				{/* Progress */}
				<div className="mt-2 flex items-center gap-2">
					<Progress value={peer.progressPercent} className="h-2 flex-1" />
					<span className="text-xs text-muted-foreground">
						{peer.progressPercent}%
					</span>
				</div>
			</div>

			{/* Invite Button */}
			<Button
				variant="outline"
				size="sm"
				onClick={onInvite}
				className="shrink-0 gap-1"
			>
				<UserPlus className="h-4 w-4" />
				<span className="hidden sm:inline">Invitar</span>
			</Button>
		</div>
	);
}

function PeerLearnersSkeleton() {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<div className="h-5 w-5 rounded bg-muted animate-pulse" />
					<div className="h-5 w-40 rounded bg-muted animate-pulse" />
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className="flex items-center gap-4 rounded-lg border p-4"
					>
						<div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
						<div className="flex-1 space-y-2">
							<div className="h-4 w-32 rounded bg-muted animate-pulse" />
							<div className="h-2 w-full rounded bg-muted animate-pulse" />
						</div>
						<div className="h-8 w-20 rounded bg-muted animate-pulse" />
					</div>
				))}
			</CardContent>
		</Card>
	);
}

export { PeerLearnersSkeleton };
