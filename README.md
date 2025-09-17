# 🚀 Resume AI Agent — Starter

> Starter code and guided steps to build a Resume AI Agent — authentication, AI agent logic, API integrations, and deployment.
> Follow the step-by-step video walkthrough: https://youtu.be/t6mJkE-lCtc

---

## 📺 Quick Link

[![Watch the tutorial](https://img.youtube.com/vi/t6mJkE-lCtc/0.jpg)](https://youtu.be/t6mJkE-lCtc)

---

## ⚡️ Features

- 🔐 Auth0-based authentication
- 🤖 LangGraph-powered AI agent for resume help
- 🔗 Google API & GitHub integrations (tools)
- ☁️ Ready for Vercel deployment
- Branch-per-step structure so you can follow the tutorial incrementally

---

## 🧭 Roadmap (branches)

The repository is organized so each branch represents a tutorial step:

- `main` — Implement authentication (Auth0)
- `chat` — Add a basic LangGraph agent (chat)
- `agent` — Integrate Google API tools
- `tools` — Add account linking + GitHub API tools
- `github` — Production-ready: deploy to Vercel

Switch to the branch for the step you're following:

```bash
git checkout chat
```

---

## 🚀 Tutorial

### Step 1: Starter Code

```bash
git clone git@github.com:thecodedose/resume-flow.git
cd resume-flow
npm install
npm run dev
```

### Step 2: Implement Authentication with Auth0

**Create an Auth0 Account and a Dev Tenant**

You need an [Auth0](https://auth0.com/ai) account and a Gen AI Developer Tenant.

**Create Application**

Create and configure a Regular Web Application.

**Allowed Callback URLs**:
http://localhost:3000/auth/callback

**Allowed Logout URLs:**
http://localhost:3000

**Install Dependencies**

In the root directory of your project, install the [Auth0 Next.js SDK](https://github.com/auth0/nextjs-auth0):

```bash
npm i @auth0/nextjs-auth0@4
```

**Create env file**

In the root directory of your project, create the `.env.local` file and add the following variables (copy AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET from Application Settings).

```bash
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
APP_BASE_URL='http://localhost:3000'
AUTH0_DOMAIN='<your-auth0-domain>'
AUTH0_CLIENT_ID='<your-auth0-application-client-id>'
AUTH0_CLIENT_SECRET='<your-auth0-application-client-secret>'
```

**Create the Auth0 client**

Create a file at `src/lib/auth0.ts` and instantiate a new Auth0 client:

```jsx
import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Create an Auth0 Client.
export const auth0 = new Auth0Client();
```

**Add the authentication middleware**

The middleware intercepts incoming requests and applies Auth0's authentication logic. Create the following file at `src/middleware.ts`:

```jsx
import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request);

  // Authentication routes — let the Auth0 middleware handle it.
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return authRes;
  }

  const { origin } = new URL(request.url);
  const session = await auth0.getSession();

  // User does not have a session — redirect to login.
  if (!session) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }
  return authRes;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image, images (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - $ (root)
     */
    '/((?!_next/static|_next/image|images|favicon.[ico|png]|sitemap.xml|robots.txt|$).*)',
  ],
};
```

Login with your Google account.

### Step 3: Implement Chat Page

**Switch to chat branch if you want to jump to this step**

```bash
git pull origin chat
git switch chat
```

### Step 4: Add Chat Logic

**Install Vercel AI SDK**

```bash
npm i @ai-sdk/react @auth0/ai-langchain @langchain/openai @langchain/community @langchain/core googleapis
```

**Use useChat hook**

```js
"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, LogOut } from "lucide-react"
import Logo from "./ui/logo"
import ReactMarkdown from "react-markdown"

type Message = {
  role: "user" | "assistant"
  content: string
}

const Chat = () => {
  const [input, setInput] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLDivElement | null
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ])

    toast({
      title: "TODO",
      description: "Implement AI agent",
    })

    setInput("")
  }

  return (
    <div className='flex h-screen bg-background'>
      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <div className='border-b border-border p-4'>
          <div className='flex items-center justify-between'>
            <Logo mode='dark' />
            <a
              href='/auth/logout'
              className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary h-10 w-10 text-secondary-foreground hover:bg-secondary/80'
            >
              <LogOut className='w-5 h-5' />
            </a>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className='flex-1 p-4'>
          <div className='max-w-3xl mx-auto space-y-6'>
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "flex justify-end gap-4"
                    : "flex justify-start gap-4"
                }
              >
                <div className='flex space-y-2'>
                  <div
                    className={
                      message.role === "user"
                        ? "bg-primary px-6 py-2 rounded-[25px] w-fit text-white text-right"
                        : "px-6 py-2 rounded-[25px] w-fit text-left"
                    }
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className='border-t border-border p-4'>
          <div className='max-w-3xl mx-auto'>
            <div className='relative'>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !!input.trim()) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder='Ask me anything about your resume...'
                className='pr-12 py-3 min-h-[48px]'
              />
              <Button
                onClick={handleSend}
                size='icon'
                className='absolute right-1 top-1'
                disabled={!input.trim()}
              >
                <Send className='w-4 h-4' />
              </Button>
            </div>
            <div className='text-xs text-muted-foreground mt-2 text-center'>
              AI can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
```

**Add chat api route and simple react agent**

```jsx
// src/app/api/chat/route.ts
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
```

### Step 5: Create Google API Tools

**Enable Token Exchange Grant**

Enable the Token Exchange Grant for your Auth0 Application. Go to Applications > [Your Application] > Settings > Advanced > Grant Types and enable the Token Exchange grant type.

**Configure Google Social Integration**

Set up a Google developer account that allows for third-party API calls by following the [Google Social Integration](https://auth0.com/ai/docs/integrations/google) instructions.


**Create Google Doc Tools**

```js
// src/lib/tools/gdocs.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { google } from "googleapis"
import { auth0 } from "@/lib/auth0"
import { extractTextFromGoogleDoc } from "../utils"

export const readGoogleDocContent = tool(
  async ({ docId }) => {
    // Get the Google OAuth token for the user
    const { token } = await auth0.getAccessTokenForConnection({
      connection: "google-oauth2",
    })

    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: token })

    const docs = google.docs({ version: "v1", auth })

    // Fetch the document
    const response = await docs.documents.get({
      documentId: docId,
    })

    const body = response.data.body?.content || []

    // Extract plain text from the document content
    const blocks = await extractTextFromGoogleDoc(body)

    return {
      blocks,
    }
  },
  {
    name: "readGoogleDocContent",
    description:
      "Reads and returns plain text content from a Google Docs document by ID with start and end index.",
    schema: z.object({
      docId: z
        .string()
        .describe(
          "The document ID from the Google Docs URL (e.g., from /document/d/<ID>/edit)."
        ),
    }),
  }
)

export const createGoogleDocResume = tool(
  async ({
    docTitle,
    fullName,
    email,
    phone,
    location,
    linkedin,
    github,
    experience,
    education,
    skills,
    projects,
  }) => {
    const { token } = await auth0.getAccessTokenForConnection({
      connection: "google-oauth2",
    })

    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: token })

    const docs = google.docs({ version: "v1", auth })

    const created = await docs.documents.create({
      requestBody: {
        title: `${fullName} - ${docTitle}`,
      },
    })

    const docId = created.data.documentId!

    let index = 1
    const requests: any[] = []
    requests.push({
      updateDocumentStyle: {
        documentStyle: {
          marginTop: {
            magnitude: 50,
            unit: "PT",
          },
          marginBottom: {
            magnitude: 50,
            unit: "PT",
          },
          marginLeft: {
            magnitude: 50,
            unit: "PT",
          },
          marginRight: {
            magnitude: 50,
            unit: "PT",
          },
        },
        fields: "marginTop,marginBottom,marginLeft,marginRight",
      },
    })

    const bold = (startIndex: number, endIndex: number) => {
      requests.push({
        updateTextStyle: {
          range: {
            startIndex,
            endIndex,
          },
          textStyle: {
            bold: true,
          },
          fields: "bold",
        },
      })
    }

    const center = (startIndex: number, endIndex: number) => {
      requests.push({
        updateParagraphStyle: {
          range: {
            startIndex,
            endIndex,
          },
          paragraphStyle: {
            alignment: "CENTER",
          },
          fields: "alignment",
        },
      })
    }

    const addSection = (title: string) => {
      requests.push({
        insertText: {
          text: `${title}\n`,
          location: {
            index,
          },
        },
      })

      requests.push({
        updateTextStyle: {
          range: {
            startIndex: index,
            endIndex: index + title.length,
          },
          textStyle: {
            bold: true,
            foregroundColor: {
              color: {
                rgbColor: {
                  red: 0.96862745,
                  green: 0.3647059,
                  blue: 0.3647059,
                },
              },
            },
            fontSize: {
              magnitude: 14,
              unit: "PT",
            },
            weightedFontFamily: {
              fontFamily: "Playfair Display",
            },
          },
          fields: "bold,fontSize,foregroundColor,weightedFontFamily",
        },
      })
      center(index, index + title.length)
      bold(index, index + title.length)
      index += title.length + 1
    }

    const addText = (text: string) => {
      requests.push({
        insertText: {
          text,
          location: {
            index,
          },
        },
      })
      requests.push({
        updateTextStyle: {
          range: {
            startIndex: index,
            endIndex: index + text.length,
          },
          textStyle: {
            fontSize: {
              magnitude: 10,
              unit: "PT",
            },
            weightedFontFamily: {
              fontFamily: "Lato",
            },
          },
          fields: "fontSize,weightedFontFamily",
        },
      })
      index += text.length
    }

    const addBullet = (text: string) => {
      const prevIndex = index
      addText(`${text}\n`)
      requests.push({
        createParagraphBullets: {
          range: {
            startIndex: prevIndex,
            endIndex: index,
          },
          bulletPreset: "BULLET_DISC_CIRCLE_SQUARE",
        },
      })
    }

    const addDuration = (text: string) => {
      const prevIndex = index
      addText(`${text}\n`)
      requests.push({
        updateTextStyle: {
          range: {
            startIndex: prevIndex,
            endIndex: index,
          },
          textStyle: {
            foregroundColor: {
              color: {
                rgbColor: {
                  red: 0.5,
                  green: 0.5,
                  blue: 0.5,
                },
              },
            },
            fontSize: {
              magnitude: 9,
              unit: "PT",
            },
            weightedFontFamily: {
              fontFamily: "Lato",
            },
          },
          fields: "foregroundColor,fontSize,weightedFontFamily",
        },
      })
    }

    const addTitle = (text: string) => {
      const prevIndex = index
      addText(`${text}`)
      requests.push({
        updateTextStyle: {
          range: {
            startIndex: prevIndex,
            endIndex: index,
          },
          textStyle: {
            fontSize: {
              magnitude: 11,
              unit: "PT",
            },
            weightedFontFamily: {
              fontFamily: "Playfair Display",
            },
          },
          fields: "fontSize,weightedFontFamily",
        },
      })
      bold(prevIndex, index)
    }

    const addRole = (text: string) => {
      const prevIndex = index
      addText(`${text}`)
      requests.push({
        updateTextStyle: {
          range: {
            startIndex: prevIndex,
            endIndex: index,
          },
          textStyle: {
            italic: true,
            fontSize: {
              magnitude: 10,
              unit: "PT",
            },
            weightedFontFamily: {
              fontFamily: "Playfair Display",
            },
          },
          fields: "italic,fontSize,weightedFontFamily",
        },
      })
    }

    addSection(fullName)

    const contactLine = `${email} | ${phone} | ${location}`
    let prevIndex = index
    addText(`${contactLine}\n`)
    center(prevIndex, index)

    prevIndex = index
    const socialLinksLine = `${linkedin} | ${github}`
    addText(`${socialLinksLine}\n\n`)
    center(prevIndex, index)

    addSection("Experience")
    for (const exp of experience) {
      addDuration(exp.duration)
      addTitle(exp.company)
      addRole(` - ${exp.role}\n`)
      for (const bullet of exp.bullets) {
        addBullet(bullet)
      }
      addText("\n")
    }

    addSection("Education")
    for (const item of education) {
      addDuration(item.duration)
      addTitle(item.institution)
      addRole(` - ${item.degree}\n`)
    }
    addText("\n")

    addSection("Projects")
    for (const project of projects) {
      addTitle(project.name)
      addText(` - ${project.description}\n`)
    }

    addText("\n")

    addSection("Skills")
    addText(`${skills.join(" · ")}\n`)

    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: { requests },
    })

    return `https://docs.google.com/document/d/${docId}/edit`
  },
  {
    name: "createGoogleDocResume",
    description:
      "Creates a developer-style resume using Google Docs and returns the document URL.",
    schema: z.object({
      docTitle: z.string().describe("The title of the document."),
      fullName: z.string().describe("Full name of the user."),
      email: z.string().describe("Email address of the user."),
      phone: z.string().describe("Phone number of the user."),
      location: z.string().describe("Location of the user."),
      linkedin: z.string().url().describe("LinkedIn URL of the user."),
      github: z.string().url().describe("GitHub URL of the user."),
      experience: z.array(
        z.object({
          role: z.string().describe("Job title of the work experience."),
          company: z.string().describe("Company name of the work experience."),
          duration: z.string().describe("Duration of the work experience."),
          bullets: z
            .array(z.string())
            .describe("Bullet points of the work experience."),
        })
      ),
      education: z.array(
        z.object({
          degree: z.string(),
          institution: z.string(),
          duration: z.string(),
        })
      ),
      skills: z.array(z.string()),
      projects: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
        })
      ),
    }),
  }
)
```

Import these tools inside chat API route file and add them in the tools array.

**Prebuilt Gmail Tools**

```js
// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server"
import { ChatOpenAI } from "@langchain/openai"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { SystemMessage } from "@langchain/core/messages"
import { convertVercelMessageToLangChainMessage } from "@/lib/message-converters"
import { toUIMessageStream } from "@ai-sdk/langchain"
import { createUIMessageStreamResponse } from "ai"
import { createGoogleDocResume, readGoogleDocContent } from "@/lib/tools/gdocs"
import {
  GmailCreateDraft,
  GmailSendMessage,
} from "@langchain/community/tools/gmail"
import { getAccessToken, withGoogleConnection } from "@/lib/auth0-ai"

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

    const gmailParams = {
      credentials: {
        accessToken: getAccessToken,
      },
    }

    const gmailDraft = new GmailCreateDraft(gmailParams)
    const gmailSend = new GmailSendMessage(gmailParams)

    const agent = createReactAgent({
      llm,
      tools: [
        readGoogleDocContent,
        createGoogleDocResume,
        withGoogleConnection(gmailDraft),
        withGoogleConnection(gmailSend),
      ],
      messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
    })

    const eventStream = agent.streamEvents(
      { messages: convertVercelMessageToLangChainMessage(messages) },
      { version: "v2" }
    )

    return createUIMessageStreamResponse({
      stream: toUIMessageStream(eventStream),
    })
  } catch (e: unknown) {
    console.error(e)

    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
```

### Step 6: Account Linking

**Create a new GitHub Social Connection**

Just like how you created a Google social connection, create a GitHub social connection.

**Add a connect with GitHub button**


**Create an action**

Follow this guide for [Client-Initiated Account Linking](https://auth0.com/ai/docs/guides/client-initiated-account-linking)

