import Link from 'next/link';
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Settings,
  ShoppingCart,
  Users2,
  Leaf,
  MapPin,
  LayoutDashboard
} from 'lucide-react';
import Image from 'next/image';
import faviconV2 from '@/components/faviconV2.png';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/react';
import { NavItem } from 'app/(dashboard)/nav-item';
import Providers from 'app/providers';
import Footer from './footer';
import { Toaster } from '@/components/ui/toaster';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <TooltipProvider>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        <Footer />
        <Toaster />
        </div>
        <Analytics />
      </main>
      </TooltipProvider>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-20 flex-col border-r bg-background sm:flex">
                    <Link
                href="https://www.sthinducollege.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={faviconV2}
                  alt="Vellambi Forest Field Site"
                  width={100}
                  height={100}
                  className="rounded-md object-contain pt-4"
                />
              </Link>
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">

      <NavItem href="/home" label="Home">
          <Home className="h-5 w-5" />
        </NavItem>

      <NavItem href="/location" label="Location">
          <MapPin className="h-5 w-5" />
      </NavItem>

      <NavItem href="/dashboard" label="Dashboard">
          <LayoutDashboard className="h-5 w-5" />
      </NavItem>

        <NavItem href="/plants" label="Plants">
          <Leaf className="h-5 w-5" />
        </NavItem>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetHeader>
          {/* CSS-based visually hidden title */}
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <Link
            href="https://www.sthinducollege.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center py-4"
          >
            <Image
              src={faviconV2}
              alt="Vellambi Forest Field Site"
              width={100}
              height={100}
              className="rounded-md object-contain"
            />
          </Link>
          
          <nav className="grid gap-4 py-5">
            <Link
              href="/home"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
            
            <Link
              href="/location"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <MapPin className="h-5 w-5" />
              Location
            </Link>
            
            <Link
              href="/dashboard"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            
            <Link
              href="/plants"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Leaf className="h-5 w-5" />
              Plants
            </Link>
          </nav>
          
          <div className="mt-auto pb-5">
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
