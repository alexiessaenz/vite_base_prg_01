import { Button } from "@/components/ui/button"
import { MeshGradient } from "@paper-design/shaders-react"
import { CardDemo } from "./display/card"

export function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <MeshGradient
        className="h-full w-full"
        colors={["#000000", "#dc2626", "#ffffff", "#7f1d1d", "#ef4444"]}
        speed={0.4}
        scale={1}
      >
        <div className="flex h-full w-full max-w-full min-w-0 flex-col gap-4 p-6 text-sm leading-loose">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-sm">Project ready!</h1>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-sm">Build beautiful</h1>
            <p className="text-4xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-6 drop-shadow-sm">You may now add components and start building.</p>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed opacity-90">We&apos;ve already added the button component for you.</p>
            <Button className="mt-2">Button</Button>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
        <CardDemo />
        </div>
      </MeshGradient>
    </div>
  )
}

export default App