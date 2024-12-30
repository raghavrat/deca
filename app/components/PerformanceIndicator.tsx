<<<<<<< HEAD
import { Datashape } from '../performanceIndicators'

export default function PerformanceIndicator({ data }: { data: Datashape }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <h4 className="text-lg font-semibold mb-2 text-[#06C167]">{data.indicator}</h4>
      <p className="text-gray-700 whitespace-pre-wrap">{data.text}</p>
=======
import { Datashape } from '../types'

export default function PerformanceIndicator({ data }: { data: Datashape }) {
  return (
    <div className="border-t pt-4 first:border-t-0 first:pt-0 transition-all duration-300 hover:bg-blue-50">
      <h4 className="text-lg font-semibold mb-2 text-blue-600">{data.indicator}</h4>
      <p className="text-gray-600">{data.text}</p>
>>>>>>> 22ee48ed548d41ef82d536d121bc20d018918773
    </div>
  )
}

