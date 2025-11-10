'use client'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Button } from '../ui/button'
import { PasswordInput } from '../password-input'
import { Input } from '../ui/input'
import { Facebook, GitBranch, LoaderCircle } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { Checkbox } from '../ui/checkbox'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginUser } from '@/config/auth-config'

const formSchema = z
    .object({
        email: z.email({ message: "Please enter a valid email" }),
        password: z.string().min(1, { message: "Password is required" }),
        rememberMe: z.boolean().optional(),
    })
type SignInValues = z.infer<typeof formSchema>;
export default function SigninForm({ className, ...props }: React.HTMLAttributes<HTMLFormElement>) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    const redirect = searchParams.get("redirect");

    const form = useForm<SignInValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        },
    })
    async function onSubmit(data: SignInValues) {
        setIsLoading(true);

        const result = await loginUser(data)
        setIsLoading(false);

        if (result.error) {
            setError(result.error.reason || "Something went wrong");
        } else {
            toast.success("Signed in successfully");
            router.push(redirect ?? "/dashboard");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:px-4 px-4 ">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center">
                                <FormLabel>Password</FormLabel>
                                <Link
                                    href="/forgot-password"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <FormControl>
                                <PasswordInput
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel>Remember me</FormLabel>
                        </FormItem>
                    )}
                />

                {error && (
                    <div role="alert" className="text-sm text-red-600">
                        {error}
                    </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    Login
                    <LoaderCircle className='me-2 animate-spin' style={{ display: isLoading ? 'inline-block' : 'none' }} />
                </Button>

                {/* <div className="flex w-full flex-col items-center justify-between gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        disabled={loading}
                        onClick={() => handleSocialSignIn("google")}
                    >
                        <GoogleIcon width="0.98em" height="1em" />
                        Sign in with Google
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        disabled={loading}
                        onClick={() => handleSocialSignIn("github")}
                    >
                        <GitHubIcon />
                        Sign in with Github
                    </Button>
                </div> */}
            </form>
        </Form>
    )
}
