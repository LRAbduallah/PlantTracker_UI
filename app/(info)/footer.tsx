import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-background py-6 px-8 text-sm text-muted-foreground">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row justify-between gap-8">

        {/* Scholar Info Section */}
        <div className="space-y-1 max-w-xl">
          <p>
            <span className="font-semibold text-foreground">P. Shasheela</span>, Reg. No: 21213159262014
          </p>
          <p>Research Scholar, S.T. Hindu College, Nagercoil - 629002</p>
          <p>
            Email:{' '}
            <a
              href="mailto:sayishasheela.pg@gmail.com"
              className="text-foreground hover:underline break-all"
            >
              sayishasheela.pg@gmail.com
            </a>
          </p>
          <div className="mt-2 space-y-1">
            <p className="font-semibold text-foreground">Supervisor:</p>
            <p className="font-semibold text-foreground">Dr. P. Uma, Assistant Professor</p>
            <p>S.T. Hindu College, Nagercoil - 629002</p>
            <p>
              Affiliated to Manonmaniam Sundaranar University,
              Abishekapatti, Tirunelveli - 627012, Tamil Nadu, India
            </p>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="min-w-[160px]">
          <h4 className="text-base font-semibold text-foreground mb-2">
            Quick Links
          </h4>
          <div className="flex flex-col gap-1">
            <Link href="/home" className="hover:underline">
              Home
            </Link>
            <Link href="/location" className="hover:underline">
              Location
            </Link>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/plants" className="hover:underline">
              Plants
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
