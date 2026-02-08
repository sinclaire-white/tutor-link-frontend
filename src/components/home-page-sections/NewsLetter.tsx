
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsLetter() {
  return (
    <section className="bg-muted/50 py-16 md:py-20 border-t">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Get new tutor announcements, learning tips, and exclusive offers directly in your inbox.
        </p>

        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1"
          />
          <Button type="submit" size="lg">
            Subscribe
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-4">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}