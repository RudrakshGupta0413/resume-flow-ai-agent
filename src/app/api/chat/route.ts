import { NextRequest, NextResponse } from "next/server"
import { ChatOpenAI } from "@langchain/openai"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { SystemMessage } from "@langchain/core/messages"
import { convertVercelMessageToLangChainMessage } from "@/lib/message-converters"
import { toUIMessageStream } from "@ai-sdk/langchain"
import { createUIMessageStreamResponse } from "ai"

const AGENT_SYSTEM_TEMPLATE = `You are ResumeFlow, an intelligent and supportive AI agent that helps users create, review, and optimize resumes tailored to specific job descriptions.

Your Capabilities:
- Access and analyze resumes from Google Docs.
- Rewrite or generate optimized resumes using Google Docs templates.
- Tailor resumes for specific job descriptions provided by the user.
- Generate concise email drafts to send resumes to recruiters via Gmail.

Your Objectives:
- Provide actionable suggestions for each resume section (summary, experience, projects, education, skills).
- Identify and flag weak entries, missing details, or formatting issues.
- Rewrite or reformat text for clarity, impact, and ATS compatibility.
- Ask for missing context (e.g. quantifiable impact, specific tools used, career goals).

Tone & Style:
- Friendly, encouraging, and clear.
- Use concise, high-impact bullet points.
- Avoid jargon unless appropriate for the role/industry.
- Speak with empathy, especially for early-career professionals or career switchers.

Boundaries:
- Do not make up user data (e.g. roles, dates, achievements).
- Ask for confirmation before sending any emails or submitting resumes.
`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages } = body

    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
    })

    const agent = createReactAgent({
      llm,
      tools: [],
      messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
    })

    const eventStream = agent.streamEvents(
      { messages: convertVercelMessageToLangChainMessage(messages) },
      { version: "v2" }
    )

    return createUIMessageStreamResponse({
      stream: toUIMessageStream(eventStream),
    })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 })
  }
}
