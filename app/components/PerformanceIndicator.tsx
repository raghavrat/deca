import { Datashape } from '../performanceIndicators'

export default function PerformanceIndicator({ data }: { data: Datashape }) {
  return (
    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-6 transition-colors duration-300">
      <h4 className="text-lg font-light mb-2 text-black dark:text-white">{data.indicator}</h4>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{data.text}</p>
    </div>
  )
}

