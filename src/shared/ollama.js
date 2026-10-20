export const OLLAMA_HOST = 'http://127.0.0.1:11434';

export function modelNames(models) {
  return (models || []).map((item) => (typeof item === 'string' ? item : item?.name || '')).filter(Boolean);
}

export function pickModels(models) {
  const names = modelNames(models);
  const bare = (name) => name.split(':')[0];
  const chat = names.find((name) => bare(name) === 'writer')
    || names.find((name) => bare(name) === 'coder')
    || names.find((name) => /qwen3\.5/i.test(name))
    || names.find((name) => /qwen/i.test(name))
    || names[0]
    || '';
  return { chatModel: chat, completeModel: '' };
}

export function installSteps(aiDir) {
  return [
    'curl -fsSL https://ollama.com/install.sh | sh',
    'systemctl --user enable --now ollama',
    'ollama pull qwen3.5:4b',
    `ollama create writer -f ${aiDir}/writer.Modelfile`,
  ].join('\n');
}
