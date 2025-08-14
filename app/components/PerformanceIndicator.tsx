import { Datashape } from '../performanceIndicators'

export default function PerformanceIndicator({ data }: { data: Datashape }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <h4 className="text-lg font-semibold mb-2 text-[#0066cc] dark:text-[#4d94ff]">{data.indicator}</h4>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{data.text}</p>
    </div>
  )
}

