import Dashboard from "@/components/Dashboard"
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/option";

const getUserDetails = async () => {
    const session = await getServerSession(authOptions);
    return session;
};

export default async function DashBoard () {
    const session = await getUserDetails()
    console.log("from dashboard", session?.user)
    const profileImg = session?.user.image || ""
    const id = session?.user.id || ""
    return <Dashboard profileImg={profileImg} id={id} />
}