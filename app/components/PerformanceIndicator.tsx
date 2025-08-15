import { Datashape } from '../performanceIndicators'
import { getIndicatorAnchorId } from '../utils/piSlug'

export default function PerformanceIndicator({ data }: { data: Datashape }) {
  const anchorId = getIndicatorAnchorId(data.indicator)
  return (
    <div id={anchorId} className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-6 transition-colors duration-300 scroll-mt-24">
      <h4 className="text-lg font-light mb-2 text-black dark:text-white">{data.indicator}</h4>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{data.text}</p>
    </div>
  )
}

