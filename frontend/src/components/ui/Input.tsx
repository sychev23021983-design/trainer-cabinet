import { InputHTMLAttributes } from 'react'
interface Props extends InputHTMLAttributes<HTMLInputElement> { label?: string }
export default function Input({ label, className = '', ...props }: Props) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${className}`}
        {...props}
      />
    </div>
  )
}
