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

    const bold = (startIndex, endIndex) => {
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

    const center = (startIndex, endIndex) => {
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
