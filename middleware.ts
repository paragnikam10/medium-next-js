import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/dashboard","/writeblog"],
};

export default withAuth(async (req) => {
 // console.log("withauth");
  //if (process.env.LOCAL_CMS_PROVIDER) return;
  const token = req.nextauth.token;
 // console.log("token ", token);
  if (!token) {
    return NextResponse.redirect(new URL("/invalidsession", req.url));
  }
});
