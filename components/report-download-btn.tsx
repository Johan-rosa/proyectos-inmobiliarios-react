"use client"
import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface DownloadButtonProps {
  firebaseId: string
  label?: string
  reportName?: string
  className?: string
  creationTime: string | Date // ISO string or Date object
}

export function DownloadButton({ firebaseId, label, reportName, className, creationTime }: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const icon = isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />
  const buttonLabel = label ? <>{icon} <span>{label}</span></> : icon

  const handleDownload = async () => {
    const createdAt = new Date(creationTime)
    const now = new Date()
    const diffInSeconds = (now.getTime() - createdAt.getTime()) / 1000

    if (diffInSeconds < 90) {
      toast.warning("El reporte aún no está listo", {
        description: "Por favor, intentar más tarde",
      })
      return
    }

    setIsLoading(true)

    toast.info("Descargando el plan de pago", {
      description: "La descarga comenzó, por favor espera",
    })

    try {
      const response = await fetch(`/api/download-report?firebaseId=${encodeURIComponent(firebaseId)}`)

      if (!response.ok) {
        throw new Error("Failed to download report, favor contactar al soporte")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = reportName ? `${reportName}.pdf` : "plan-de-pago.pdf"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Descarga completa")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("La descarga falló. Por favor, intenta nuevamente en unos segundo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      variant="ghost"
      size="icon"
      aria-label={label ? `Download ${label}` : "Download report"}
      title={label ? `Download ${label}` : "Download report"}
      className={className}
    >
      {buttonLabel}
    </Button>
  )
}
