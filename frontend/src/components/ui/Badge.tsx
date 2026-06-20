interface BadgeProps { color?: 'green' | 'yellow' | 'red' | 'gray'; children: React.ReactNode }
const colors = {
  green: 'bg-green-50 text-green-700',
  yellow: 'bg-yellow-50 text-yellow-700',
  red: 'bg-red-50 text-red-700',
  gray: 'bg-gray-100 text-gray-600',
}
export default function Badge({ color = 'gray', children }: BadgeProps) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>{children}</span>
}
