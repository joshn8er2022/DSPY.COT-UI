import { MainInterface } from '@/components/main-interface'

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Welcome to DSPy Chain of Thought
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Experience advanced AI reasoning with DSPy-inspired chain of thought processing. 
          Configure your API credentials and start exploring structured reasoning patterns.
        </p>
      </div>
      
      <MainInterface />
    </div>
  )
}
