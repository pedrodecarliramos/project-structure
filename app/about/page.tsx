import { Header } from "@/components/blog/header"
import { Footer } from "@/components/blog/footer"
import { Card } from "@/components/ui/card"

export const metadata = {
  title: "About - Modern Blog",
  description: "Learn more about our blog and mission",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-lg text-muted-foreground">Learn more about our mission and what we do</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-8">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We're dedicated to sharing high-quality content about web development, programming, and design. Our
                  goal is to help developers and designers stay up to date with the latest trends, best practices, and
                  technologies in the industry.
                </p>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">What We Cover</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Modern web development frameworks and tools like Next.js, React, and TypeScript</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Programming best practices and software engineering principles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>UI/UX design techniques and modern CSS approaches</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Web accessibility and inclusive design practices</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">Our Team</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our team consists of experienced developers, designers, and technical writers who are passionate about
                  sharing their knowledge and helping others grow in their careers. We believe in creating content that
                  is both educational and practical.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
