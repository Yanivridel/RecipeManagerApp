import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/providers/theme-provider";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "./ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";

export function ModeToggle() {
    const { setTheme } = useTheme();

    return (
    <DropdownMenu>
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem className="list-none mb-1">
            <CollapsibleContent>
                <SidebarMenuSub className="dropdown-bg-hover p-2 pl-4 rounded-xl cursor-pointer">
                    <SidebarMenuSubItem onClick={() => setTheme("light")}>
                        Light
                    </SidebarMenuSubItem>
                </SidebarMenuSub>

                <SidebarMenuSub className="dropdown-bg-hover p-2 pl-4 rounded-xl cursor-pointer">
                    <SidebarMenuSubItem onClick={() => setTheme("dark")}>
                        Dark
                    </SidebarMenuSubItem>
                </SidebarMenuSub>
                <SidebarMenuSub className="dropdown-bg-hover p-2 pl-4 rounded-xl cursor-pointer">
                <SidebarMenuSubItem onClick={() => setTheme("system")}>
                    System
                </SidebarMenuSubItem>
                </SidebarMenuSub>
            </CollapsibleContent>
            <CollapsibleTrigger asChild>
                <SidebarMenuButton variant="default" size="sm">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <span>Change Theme</span>
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
                </SidebarMenuButton>
            </CollapsibleTrigger>
            </SidebarMenuItem>
        </Collapsible>
    </DropdownMenu>
    );
}