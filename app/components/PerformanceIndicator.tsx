import { Datashape } from '../performanceIndicators'

export default function PerformanceIndicator({ data }: { data: Datashape }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <h4 className="text-lg font-semibold mb-2 text-[#06C167]">{data.indicator}</h4>
      <p className="text-gray-700 whitespace-pre-wrap">{data.text}</p>
    </div>
  )
}

