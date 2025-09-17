import {Button} from "@/components/ui/button";
import {useAuth} from "../../context/useAuth";
import {Menu} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {sidebarLinks} from "@/components/Sidebar";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const Navbar = ({ toggle }: any) => {
    const { user, logout } = useAuth()

    const router = useRouter()
    return (
        <div className="w-full h-16 bg-white shadow flex items-center justify-between px-4 sticky top-0 z-30">
            <Button variant="ghost" size="icon" onClick={toggle}>
                <Menu className="w-6 h-6" />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className='cursor-pointer'>
                        <AvatarImage src={user?.avatarUrl} />
                        <AvatarFallback className='bg-orange-300 '>{user?.userName?.[0].toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {sidebarLinks.map((link, idx) => (
                        <DropdownMenuItem  key={idx}>
                            <a

                                href={link.href}
                                className="rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                            >
                                {link.label}
                            </a>
                        </DropdownMenuItem>

                    ))}
                    <DropdownMenuItem >
                        <a

                            onClick={() => {
                                logout();
                                router.push('/sign-up')
                                toast.success('Вы успешно вышли')
                            }}
                            className="rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                        >
                            Выйти
                        </a>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    )
}
export default Navbar