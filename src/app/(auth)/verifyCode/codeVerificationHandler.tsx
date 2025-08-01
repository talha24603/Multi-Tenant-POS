'use server'

import prisma from "@/prismaClient"

export default async function codeVerificationHandler(verifyCode:string,email:string) {
    try {
        
        const user =await prisma.user.findUnique({
            where: {
                email: email
                },
        })
        if (user) {
            if (user.otp === verifyCode) {
                await prisma.user.update({
                    where: {
                        email: email
                        },
                        data: {
                            isVerified: true
                            }
                            })
                return { success: true }
            }
            else{
                return { success: false }
            }
        }
    } catch (error) {
        console.error(error)
        return { success: false }
        
    }
}