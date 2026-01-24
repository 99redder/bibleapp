export function Select({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  id,
  name
}) {
  const selectId = id || name || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`input bg-white dark:bg-gray-800 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
