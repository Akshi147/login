export function InputBox({ label, placeholder, onChange, required, type }) {
  return (
    <div>
      <div className="text-sm font-medium text-left py-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </div>
      <input
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className="w-full px-2 py-1 border rounded border-slate-200"
      />
    </div>
  );
}
