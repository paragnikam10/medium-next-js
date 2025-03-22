"use client";

import Writeblog from "@/components/Writeblog";
import { Suspense } from "react";

export default function WriteBlog() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Writeblog />
        </Suspense>
    );
}
