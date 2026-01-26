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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre Nós</h1>
            <p className="text-lg text-muted-foreground">Saiba mais sobre nossa missão e o que fazemos</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-8">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Estamos dedicados a compartilhar conteúdo de alta qualidade sobre desenvolvimento web, programação e design. Nosso
                  objetivo é ajudar desenvolvedores e designers a se manterem atualizados com as últimas tendências, boas práticas e
                  tecnologias em uso.
                </p>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">O Que Cobrimos</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Frameworks e ferramentas modernas de desenvolvimento web como Next.js, React e TypeScript</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Boas práticas de programação e princípios de engenharia de software</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Técnicas de design UI/UX e abordagens modernas de CSS</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Acessibilidade web e práticas de design inclusivo</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">Nossa Equipe</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nossa equipe consiste em desenvolvedores, designers e redatores técnicos experientes que são apaixonados por
                  compartilhar seu conhecimento e ajudar outros a crescerem em suas carreiras. Acreditamos em criar conteúdo que
                  seja tanto educacional quanto prático.
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
