const enabled = process.stdout.isTTY && !process.env.NO_COLOR

export function paint(code, text) {
  const value = String(text)
  if (!enabled) return value
  return `\x1b[${code}m${value}\x1b[0m`
}

export function askText(message) {
  return paint('1;36', message)
}

export function success(text) {
  return paint('1;32', text)
}

export function warning(text) {
  return paint('1;31', text)
}

export function number(value) {
  return paint('1;33', value)
}

export function field(name, value) {
  const shown = Array.isArray(value) ? value.join(', ') : (value ?? '')
  return `${paint('1;35', `${name}:`)} ${shown}`
}
