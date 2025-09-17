"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
export function FloatingNavDemo() {
    const navItems = [
        {
            name: "Главная",
            link: "/",
            icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
            name: "Панель управления",
            link: "/dashboard",
            icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
            name: "Профиль",
            link: "/workspace/profile",
            icon: (
                <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
            ),
        },
    ];
    return (
        <div className="">
            <FloatingNav navItems={navItems} />

        </div>
    );
}
