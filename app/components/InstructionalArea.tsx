import { Datashape } from '../performanceIndicators'
import PerformanceIndicator from './PerformanceIndicator'

interface InstructionalAreaProps {
  area: string
  indicators: Datashape[]
}

export default function InstructionalArea({ area, indicators }: InstructionalAreaProps) {
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">{area}</h3>
      {indicators.map((indicator, index) => (
        <PerformanceIndicator key={index} data={indicator} />
      ))}
    </div>
  )
}

