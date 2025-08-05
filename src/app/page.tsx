"use client"
import LoginPage from "@/components/LoginPage"
import { toast } from "@/hooks/use-toast"

const Index = () => {
  const handleGoogleLogin = () => {
    toast({
      title: "Login Successful!",
      description: "Welcome to your AI-powered resume optimizer.",
    })
    // Here you would integrate with Auth0 or another auth service
    console.log("Google login clicked - integrate with Auth0 here")
  }

  return <LoginPage onGoogleLogin={handleGoogleLogin} />
}

export default Index
