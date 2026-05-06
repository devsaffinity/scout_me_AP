const defaultOptions = [2, 4, 6, 8];

const PageSizeControl = ({
  value,
  onChange,
  options = defaultOptions,
  label = 'Rows per page',
}) => {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-500">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange?.(Number(event.target.value))}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

export default PageSizeControl;
