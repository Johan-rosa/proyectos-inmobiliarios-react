"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface DownloadButtonProps {
  firebaseId: string
  label?: string
}

export function DownloadButton({ firebaseId, label }: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)

    toast.info("Descargando el plan de pago", {
      description: "Si es la primera vez que descargas el reporte, puede tardar varios segundos.",
    })

    try {
      const response = await fetch(`/api/download-report?firebaseId=${encodeURIComponent(firebaseId)}`)

      if (!response.ok) {
        throw new Error("Failed to download report")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = label ? `${label}.pdf` : "report.pdf"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Descarga completa")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Falló la descarga, favor intentar nuevamente.")
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
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
    </Button>
  )
}

