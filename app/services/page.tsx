import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Star } from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">ServiceHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/services" className="font-medium transition-colors text-primary">
              Services
            </Link>
            <Link href="/about" className="font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Find the Perfect Service Provider
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Browse through our extensive list of verified service providers
                </p>
              </div>
              <div className="w-full max-w-3xl space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex-1">
                    <Input placeholder="Search services..." className="w-full" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="gardening">Gardening</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="beauty">Beauty & Spa</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full sm:w-auto">Search</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Popular Services</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Browse our most popular service categories
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: 1,
                  name: "Home Cleaning",
                  description: "Professional cleaning services for homes of all sizes",
                  providers: 24,
                  rating: 4.8,
                },
                {
                  id: 2,
                  name: "Plumbing",
                  description: "Expert plumbers for repairs, installations, and maintenance",
                  providers: 18,
                  rating: 4.7,
                },
                {
                  id: 3,
                  name: "Electrical",
                  description: "Licensed electricians for all your electrical needs",
                  providers: 15,
                  rating: 4.9,
                },
                {
                  id: 4,
                  name: "Gardening",
                  description: "Professional gardeners for lawn care and landscaping",
                  providers: 12,
                  rating: 4.6,
                },
                {
                  id: 5,
                  name: "Personal Training",
                  description: "Certified personal trainers for fitness and wellness",
                  providers: 20,
                  rating: 4.8,
                },
                {
                  id: 6,
                  name: "Beauty & Spa",
                  description: "Professional beauty and spa services for relaxation",
                  providers: 22,
                  rating: 4.7,
                },
              ].map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-muted-foreground">Service Providers</p>
                        <p className="font-medium">{service.providers}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium">{service.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">View Providers</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <span className="text-lg font-bold">ServiceHub</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ServiceHub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
