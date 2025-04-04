import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get the firebaseId from the URL query parameters
    const { searchParams } = new URL(request.url)
    const firebaseId = searchParams.get("firebaseId")

    if (!firebaseId) {
      return NextResponse.json({ error: "Firebase ID is required" }, { status: 400 })
    }

    console.log(`Fetching report for Firebase ID: ${firebaseId}`) // Add logging

    const response = await fetch(
      `https://octopus-app-axggo.ondigitalocean.app/report?firebase_id=${encodeURIComponent(firebaseId)}`,
      {
        method: "GET",
        signal: AbortSignal.timeout(30000), // 30 seconds timeout
      },
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const pdfData = await response.arrayBuffer()

    return new NextResponse(pdfData, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="report.pdf"',
      },
    })
  } catch (error) {
    console.error("Error fetching report:", error)
    return NextResponse.json({ error: "Failed to download report" }, { status: 500 })
  }
}

