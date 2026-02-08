
export function Footer() {
  return (
    <footer className="bg-background border-t py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TutorLink. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="/privacy" className="hover:text-foreground">Privacy Policy</a>
            <a href="/terms" className="hover:text-foreground">Terms of Service</a>
            <a href="/contact" className="hover:text-foreground">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}