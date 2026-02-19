content = open("src/components/Player/MarketValue.tsx", "r", encoding="utf-8").read()
old = """      <div className='flex flex-col items-end'>
        <div className='flex items-center gap-2'>
          <ConfidenceBadge confidence={marketValue.confidence} />
          <span className='font-medium'>~${marketValue.estimatedValue}</span>
        </div>
        <div className='mt-1 text-xs text-gray-500'>
          Range: ${marketValue.priceRange.low}-$
          {marketValue.priceRange.high}
        </div>
      </div>"""
new = """      <div className='flex flex-col items-end'>
        <div className='flex items-center gap-2'>
          <ConfidenceBadge confidence={marketValue.confidence} />
          <div className='group relative'>
            <span className='font-medium cursor-help'>~${marketValue.estimatedValue}</span>
            {marketValue.sales && marketValue.sales.length > 0 && (
              <div className='absolute bottom-6 right-0 z-10 w-72 scale-0 rounded-lg bg-white p-3 shadow-xl ring-1 ring-gray-200 transition-all group-hover:scale-100 dark:bg-gray-900 dark:ring-gray-700'>
                <p className='text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide'>Recent Sales ({marketValue.sales.length})</p>
                <div className='flex flex-col gap-1 max-h-48 overflow-y-auto'>
                  {marketValue.sales.slice(0, 15).map((s, i) => (
                    <div key={i} className='flex justify-between text-xs'>
                      <span className='text-gray-400'>{new Date(s.date).toLocaleDateString()} {s.age ? ` ${s.age}y` : ""} {s.overall ? ` OVR ${s.overall}` : ""}</span>
                      <span className='font-semibold text-gray-700 dark:text-gray-200'>${s.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='mt-1 text-xs text-gray-500'>
          Range: ${marketValue.priceRange.low}-$
          {marketValue.priceRange.high}
        </div>
      </div>"""
result = content.replace(old, new)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/MarketValue.tsx", "w", encoding="utf-8").write(result)
