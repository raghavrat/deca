import { Datashape } from '../types'
import PerformanceIndicator from './PerformanceIndicator'

interface InstructionalAreaProps {
  area: string
  indicators: Datashape[]
}

export default function InstructionalArea({ area, indicators }: InstructionalAreaProps) {
  return (
    <div className="mb-8 bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">{area}</h3>
      <div className="space-y-6">
        {indicators.map((indicator, index) => (
          <PerformanceIndicator key={index} data={indicator} />
        ))}
      </div>
    </div>
  )
}

