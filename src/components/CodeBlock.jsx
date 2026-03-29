import { motion } from 'framer-motion';

export function CodeBlock({ code, lang = 'csharp', delay = 0 }) {
  return (
    <motion.div
      className="code-block"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{ position: 'relative' }}
    >
      <span className="code-lang">{lang}</span>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        <code dangerouslySetInnerHTML={{ __html: code }} />
      </pre>
    </motion.div>
  );
}

// Highlight helpers
export function cs(strings, ...values) {
  let result = '';
  strings.forEach((str, i) => {
    result += str;
    if (i < values.length) result += values[i];
  });
  return result;
}
