import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Sparkle from "@/components/ui/sparkle"

const LoginPage = () => {
  return (
    <div className='min-h-screen flex items-center justify-center relative overflow-hidden'>
      {/* Background with hero image */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: "./assets/login-hero-bg.jpg" }}
      />

      {/* Gradient overlay */}
      <div className='absolute inset-0 bg-gradient-hero opacity-80' />

      {/* Logo */}
      <div className='absolute top-8 left-8 z-20'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30'>
            <svg
              className='w-6 h-6 text-white'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <polyline
                points='14,2 14,8 20,8'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <circle
                cx='12'
                cy='13'
                r='2'
                stroke='currentColor'
                strokeWidth='2'
              />
              <path
                d='M12 11v4'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
              />
              <path
                d='M10 13h4'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
              />
            </svg>
          </div>
          <div className='text-white'>
            <h2 className='text-xl font-bold tracking-tight'>ResumeFlow</h2>
            <p className='text-xs text-white/80 font-medium'>AI-Powered</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='relative z-10 w-full max-w-md mx-auto px-4 sm:px-6'>
        {/* Login Card */}
        <Card className='bg-gradient-card backdrop-blur-lg border-0 shadow-card animate-fade-slide-in'>
          <CardContent className='p-8 sm:p-10 text-center'>
            {/* Hero Section */}
            <div className='mb-8 animate-fade-in'>
              <h1 className='text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight'>
                Your Resume.{" "}
                <span className='bg-gradient-hero bg-clip-text text-transparent'>
                  Upgraded by AI.
                </span>
              </h1>

              {/* Resume Enhancement Graphic */}
              <div className='flex justify-center mb-6'>
                <div className='relative w-32 h-24'>
                  {/* Document Base */}
                  <div className='absolute inset-0 bg-white rounded-lg shadow-lg border border-gray-200 transform rotate-2'>
                    <div className='p-3 space-y-2'>
                      <div className='h-2 bg-gray-300 rounded w-3/4'></div>
                      <div className='h-2 bg-gray-300 rounded w-full'></div>
                      <div className='h-2 bg-gray-300 rounded w-2/3'></div>
                    </div>
                  </div>

                  {/* Enhanced Document */}
                  <div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-xl border-2 border-primary/20 transform -rotate-2 translate-x-4'>
                    <div className='p-3 space-y-2'>
                      <div className='h-2 bg-gradient-to-r from-primary to-accent rounded w-3/4'></div>
                      <div className='h-2 bg-gradient-to-r from-primary to-accent rounded w-full'></div>
                      <div className='h-2 bg-gradient-to-r from-primary to-accent rounded w-2/3'></div>
                    </div>
                  </div>

                  {/* AI Spark */}
                  <div className='absolute -top-2 -right-2 w-6 h-6 bg-gradient-hero rounded-full flex items-center justify-center'>
                    <svg
                      className='w-4 h-4 text-white'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M13 1L8 12h5l-1 10 5-11h-5l1-10z' />
                    </svg>
                  </div>

                  {/* Magic Sparkles */}
                  <Sparkle className='absolute top-1 left-8' />
                  <Sparkle
                    className='absolute bottom-2 right-0'
                    delay='300ms'
                  />
                </div>
              </div>

              <p className='text-muted-foreground text-base sm:text-lg leading-relaxed max-w-sm mx-auto'>
                Instant feedback and rewrites tailored to your dream job.
              </p>
            </div>

            {/* Login Button */}
            <div className='space-y-4'>
              <Button
                variant='login'
                size='lg'
                className='w-full h-12 text-base font-semibold  relative group cursor-pointer'
              >
                <div className='flex uppercase items-center gap-3'>
                  <span>Get Started</span>
                </div>
              </Button>

              <p className='text-xs text-muted-foreground mt-4 leading-relaxed'>
                By continuing, you agree to our{" "}
                <a
                  href='#'
                  className='text-primary hover:underline font-medium'
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href='#'
                  className='text-primary hover:underline font-medium'
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust indicators */}
        <div className='mt-8 text-center animate-fade-in'>
          <p className='text-sm text-primary-foreground/70 mb-4'>
            Trusted by 10,000+ job seekers
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
