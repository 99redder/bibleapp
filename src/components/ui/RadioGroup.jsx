export function RadioGroup({
  label,
  name,
  value,
  onChange,
  options,
  error
}) {
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map(option => (
          <label
            key={option.value}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              value === option.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
            />
            <div className="ml-3">
              <span className="block text-sm font-medium text-gray-900 dark:text-white">
                {option.label}
              </span>
              {option.description && (
                <span className="block text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </span>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
