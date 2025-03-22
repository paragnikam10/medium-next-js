
import Dashboard from "@/components/Dashboard";
import { auth } from "@/lib/auth";

export default async function DashBoardPage() {
    const session = await auth();

    if (!session || !session.user) {
        return <p>Please sign in to access the dashboard.</p>;
    }

    const profileImg = session?.user?.image || "";
    const id = session?.user?.id || "";

    return <Dashboard profileImg={profileImg} id={id} />;
}
