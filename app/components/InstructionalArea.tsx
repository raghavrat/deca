<<<<<<< HEAD
import { Datashape } from '../performanceIndicators'
=======
import { Datashape } from '../types'
>>>>>>> 22ee48ed548d41ef82d536d121bc20d018918773
import PerformanceIndicator from './PerformanceIndicator'

interface InstructionalAreaProps {
  area: string
  indicators: Datashape[]
}

export default function InstructionalArea({ area, indicators }: InstructionalAreaProps) {
  return (
<<<<<<< HEAD
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">{area}</h3>
      {indicators.map((indicator, index) => (
        <PerformanceIndicator key={index} data={indicator} />
      ))}
=======
    <div className="mb-8 bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">{area}</h3>
      <div className="space-y-6">
        {indicators.map((indicator, index) => (
          <PerformanceIndicator key={index} data={indicator} />
        ))}
      </div>
>>>>>>> 22ee48ed548d41ef82d536d121bc20d018918773
    </div>
  )
}

