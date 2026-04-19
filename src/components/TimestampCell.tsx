const timestampFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  month: 'short',
  day: 'numeric',
})

export default function TimestampCell({ value }: { value: string }) {
  const formatted = timestampFormatter.format(new Date(value))
  const [time, meridiem, month, day] = formatted.split(' ')

  return (
    <span className="timestamp-cell">
      <span>
        {time} {meridiem}
      </span>
      <span>
        {month} {day}
      </span>
    </span>
  )
}
