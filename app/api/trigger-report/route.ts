import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { firebaseId } = await request.json()

    if (!firebaseId) {
      return NextResponse.json({ error: "Firebase ID is required" }, { status: 400 })
    }

    // Make the POST request to the external service
    await fetch(`https://octopus-app-axggo.ondigitalocean.app/report/trigger?firebase_id=${firebaseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Return a simple success response without waiting for or processing the external API response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error triggering report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
