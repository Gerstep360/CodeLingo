const allowed = /^vargas_(duo_(completed|streak|xp|daily_xp|last_date|custom_snippets)|learning_v2|active_lesson|session_[a-zA-Z0-9_:\-]+|code_draft_[a-zA-Z0-9_:\-]+|editor_draft_[a-zA-Z0-9_:\-]+)$/;
export function validateValues(values) {
  if (!values || typeof values !== 'object' || Array.isArray(values) || Object.keys(values).length > 500) throw new Error('Formato de progreso no válido.');
  for (const [key, value] of Object.entries(values)) {
    if (!allowed.test(key) || key.length > 240 || typeof value !== 'string' || value.length > 500000) throw new Error('Datos de progreso no válidos.');
  }
  if (JSON.stringify(values).length > 1000000) throw new Error('El progreso supera el límite de 1 MB.');
  return { ...values };
}
let values = {}, onChange = () => {};
export const accountStorage = {
  getItem: key => values[key] ?? null,
  setItem(key, value) {
    if (!allowed.test(key)) throw new Error('Clave de progreso no permitida.');
    value = String(value);
    if (values[key] === value) return;
    values[key] = value;
    onChange();
  },
  removeItem(key) { if (Object.hasOwn(values, key)) { delete values[key]; onChange(); } },
  key: index => Object.keys(values)[index] ?? null,
  get length() { return Object.keys(values).length; },
  snapshot: () => ({ ...values }),
  hydrate(data) { values = validateValues(data); },
  subscribe(callback) { onChange = callback; return () => { onChange = () => {}; }; },
};
export function legacyProgress(storage = globalThis.localStorage) {
  const result = {};
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (allowed.test(key)) result[key] = storage.getItem(key);
  }
  return validateValues(result);
}
