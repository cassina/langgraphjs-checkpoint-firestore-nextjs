'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Tabs } from '@/components/ui/tabs'
import {Button} from '@/components/ui/button';

interface RegisterProps {
    onLogin: () => void;
}

export default function Register(props: RegisterProps) {
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Welcome</CardTitle>
                </CardHeader>
                
                <CardContent>
                    <Tabs defaultValue="login">
                        <Button onClick={props.onLogin}>Login with Google</Button>
                        
                        {/* TODO: We'll add the tabs later */}
                        {/*<TabsList className="grid w-full grid-cols-2 mb-4">*/}
                        {/*    <TabsTrigger value="login">Login</TabsTrigger>*/}
                        {/*    <TabsTrigger value="signup">Sign Up</TabsTrigger>*/}
                        {/*</TabsList>*/}
                        
                        {/*<TabsContent value="login">*/}
                        {/*    <LoginForm />*/}
                        {/*</TabsContent>*/}
                        
                        {/*<TabsContent value="signup">*/}
                        {/*    <SignupForm onSignup={onSignup} />*/}
                        {/*</TabsContent>*/}
                    </Tabs>
                </CardContent>
                
                <CardFooter className="text-center text-sm text-gray-500">
                    By continuing, you agree to our Terms & Privacy Policy.
                </CardFooter>
            </Card>
        </div>
    )
}
