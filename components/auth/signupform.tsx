"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Input } from '../ui/input'
import Password from '../ui/password'
import Button from '../custombutton'
import Google from '@/public/icons/google'
import HeadingGroup from '../headinggroup'
import { Field, FieldLabel, FieldError, FieldGroup } from '../ui/field'
import { signIn, signUp } from '@/lib/auth-client'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

const Signupform = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: signupSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      await signUp.email(
        {
          name: value.name,
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            toast.success('Account created! Please verify your email.')
            router.push(`/verify-email?email=${encodeURIComponent(value.email)}`)
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || 'Sign up failed. Please try again.')
          },
        }
      )
      setIsLoading(false)
    },
  })

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    await signIn.social(
      {
        provider: 'google',
        callbackURL: `${window.location.origin}/dashboard`,
      },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message || 'Google sign in failed.')
          setIsGoogleLoading(false)
        },
      }
    )
  }

  return (
    <div className="w-full max-w-md space-y-6">
       <HeadingGroup
         heading="Create Account"
         description="Sign up to get MOT repair quotes from trusted garages"
       />
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <FieldGroup className="gap-4">
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid} className="gap-1">
                    <FieldLabel htmlFor={field.name} className="text-[0.85rem] font-medium text-gray-900">
                      Name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="Enter your name"
                      className="h-12"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isLoading || isGoogleLoading}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />

            <form.Field
              name="email"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid} className="gap-1">
                    <FieldLabel htmlFor={field.name} className="text-[0.85rem] font-medium text-gray-900">
                      Email
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="Enter your email"
                      className="h-12"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isLoading || isGoogleLoading}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid} className="gap-1">
                    <FieldLabel htmlFor={field.name} className="text-[0.85rem] font-medium text-gray-900">
                      Password
                    </FieldLabel>
                    <Password
                      id={field.name}
                      name={field.name}
                      placeholder="Create a password"
                      className="h-12"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(value) => field.handleChange(value)}
                      aria-invalid={isInvalid}
                      disabled={isLoading || isGoogleLoading}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          <Button
            type="submit"
            fullWidth
            className='py-6'
            loading={isLoading}
            loadingText="Creating account..."
            disabled={isLoading || isGoogleLoading}
          >
            Sign Up
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[#E0E0E0]" />
            <span className="text-sm text-[#838383]">or</span>
            <div className="flex-1 h-px bg-[#E0E0E0]" />
          </div>

          <Button
            type="button"
            fullWidth
            normalColor="#FFFFFF"
            textColor="#272829"
            loadingColor="#f5f5f5"
            loadingTextColor="#272829"
            loadingText="Connecting..."
            className="border border-[#E0E0E0] py-6 hover:bg-[#f0f0f0]"
            onClick={handleGoogleSignIn}
            loading={isGoogleLoading}
            disabled={isLoading || isGoogleLoading}
          >
            <Google />
            Continue with Google
          </Button>
        </form>
    </div>
  )
}

export default Signupform
