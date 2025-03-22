"use client"

import Dashboard from "@/components/Dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/option";

export default async function DashBoardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return <p>Please sign in to access the dashboard.</p>;
    }

    const profileImg = session?.user?.image || "";
    const id = session?.user?.id || "";

    return <Dashboard profileImg={profileImg} id={id} />;
}
