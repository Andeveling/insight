import React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/cn";

interface MarkdownRendererProps {
  /**
   * El contenido markdown a renderizar
   */
  content: string;
  /**
   * Clases adicionales para el contenedor
   */
  className?: string;
  /**
   * Variante de estilos predefinidos
   * - default: estilos base con prose
   * - compact: menos espaciado, ideal para cards
   * - detailed: más espaciado y destacado, ideal para contenido largo
   */
  variant?: "default" | "compact" | "detailed";
}

/**
 * Markdown Renderer Component
 *
 * Componente reutilizable para renderizar Markdown con estilos consistentes.
 * Soporta diferentes variantes para adaptarse a distintos contextos.
 *
 * @example
 * // Uso básico
 * <MarkdownRenderer content={markdownText} />
 *
 * @example
 * // Con variante compacta para cards
 * <MarkdownRenderer content={description} variant="compact" />
 *
 * @example
 * // Con variante detallada para contenido largo
 * <MarkdownRenderer content={moduleContent} variant="detailed" />
 */
export function MarkdownRenderer({
  content,
  className,
  variant = "default",
}: MarkdownRendererProps) {
  const baseClasses =
    "prose dark:prose-invert max-w-none prose-p:text-foreground prose-strong:text-foreground prose-strong:font-bold prose-li:text-foreground prose-headings:text-foreground";

  const variantClasses = {
    default:
      "prose-base prose-p:my-4 prose-p:leading-relaxed prose-headings:mt-6 prose-headings:mb-3 prose-ul:my-4 prose-ol:my-4 prose-li:my-1",
    compact:
      "prose-sm prose-p:my-2 prose-p:leading-relaxed prose-headings:mt-4 prose-headings:mb-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5",
    detailed:
      "prose-lg prose-p:my-4 prose-p:leading-relaxed prose-headings:mt-8 prose-headings:mb-4 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-ul:my-6 prose-ul:space-y-2 prose-ol:my-6 prose-ol:space-y-2 prose-li:my-2",
  };

  const codeClasses =
    "prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-4 prose-pre:overflow-x-auto";

  const blockquoteClasses =
    "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6";

  const listClasses =
    "prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6";

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        codeClasses,
        blockquoteClasses,
        listClasses,
        className
      )}
    >
      <ReactMarkdown
        components={{
          // Párrafos
          p: ({ children }) => (
            <p
              className={cn(
                "leading-relaxed text-foreground",
                variant === "compact" && "my-2",
                variant === "default" && "my-4",
                variant === "detailed" && "my-4"
              )}
            >
              {children}
            </p>
          ),

          // Encabezados
          h1: ({ children }) => (
            <h1
              className={cn(
                "font-bold text-foreground",
                variant === "compact" && "text-xl mt-4 mb-2",
                variant === "default" && "text-2xl mt-6 mb-3",
                variant === "detailed" && "text-3xl mt-8 mb-4"
              )}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className={cn(
                "font-bold text-foreground",
                variant === "compact" && "text-lg mt-3 mb-2",
                variant === "default" && "text-xl mt-6 mb-3",
                variant === "detailed" && "text-2xl mt-8 mb-4"
              )}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className={cn(
                "font-bold text-foreground",
                variant === "compact" && "text-base mt-3 mb-1.5",
                variant === "default" && "text-lg mt-5 mb-2.5",
                variant === "detailed" && "text-xl mt-6 mb-3"
              )}
            >
              {children}
            </h3>
          ),

          // Listas
          ul: ({ children }) => (
            <ul
              className={cn(
                "list-disc pl-6 text-foreground",
                variant === "compact" && "my-2 space-y-0.5",
                variant === "default" && "my-4 space-y-1",
                variant === "detailed" && "my-6 space-y-2"
              )}
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              className={cn(
                "list-decimal pl-6 text-foreground",
                variant === "compact" && "my-2 space-y-0.5",
                variant === "default" && "my-4 space-y-1",
                variant === "detailed" && "my-6 space-y-2"
              )}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li
              className={cn(
                "text-foreground",
                variant === "compact" && "my-0.5",
                variant === "default" && "my-1",
                variant === "detailed" && "my-2"
              )}
            >
              {children}
            </li>
          ),

          // Formato de texto
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground">{children}</em>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote
              className={cn(
                "border-l-4 border-primary pl-4 italic text-foreground",
                variant === "compact" && "my-3",
                variant === "default" && "my-4",
                variant === "detailed" && "my-6"
              )}
            >
              {children}
            </blockquote>
          ),

          // Código
          code: ({ children, className: codeClassName }) => {
            // Si es un bloque de código (tiene className)
            if (codeClassName) {
              return (
                <code
                  className={cn(
                    "block bg-muted border rounded-lg overflow-x-auto text-foreground",
                    variant === "compact" && "p-2 my-2 text-xs",
                    variant === "default" && "p-3 my-3 text-sm",
                    variant === "detailed" && "p-4 my-4 text-sm"
                  )}
                >
                  {children}
                </code>
              );
            }
            // Si es código inline
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">
                {children}
              </code>
            );
          },

          // Enlaces
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          // Separadores
          hr: () => <hr className="my-8 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
