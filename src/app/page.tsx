import LoginPage from "@/components/LoginPage"
import { auth0 } from "@/lib/auth0"

const Index = async () => {
  const session = await auth0.getSession()
  console.log(session)
  return <LoginPage />
}

export default Index
