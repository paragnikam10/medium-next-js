import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option"; 

export async function auth() {
    return await getServerSession(authOptions);
}
