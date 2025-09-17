
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
    IconBrandGithub,
    IconBrandX,
    IconExchange,
    IconHome,
    IconNewSection,
    IconTerminal2,
} from "@tabler/icons-react";
import {FaVk} from "react-icons/fa";
import {FileIcon, User2Icon} from "lucide-react";

export function Navbarik() {
    const links = [
        {
            title: "Home",
            icon: (
                <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/",
        },

        {
            title: "Dashboard",
            icon: (
                <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/dashboard",
        },
        {
            title: "Дашборд",
            icon: (
                <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/workspace",
        },
        {
            title: "vk",
            icon: (
                <FaVk/>
            ),
            href: "https://vk.com",
        },
        {
            title: "About us",
            icon: (
                <FileIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/",
        },


        {
            title: "GitHub",
            icon: (
                <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "https://github.com/Ivancaswda",
        },
        {
            title: "Profile",
            icon: (
                <User2Icon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/workspace/profile",
        },
    ];
    return (
        <div className="flex sticky top-0 z-20 items-center justify-center h-[5rem] w-full">
            <FloatingDock
                mobileClassName="translate-y-20" // only for demo, remove for production
                items={links}
            />
        </div>
    );
}
