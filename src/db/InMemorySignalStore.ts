import { SignalOutput } from '../models/SignalOutput';

const store = new Map<string, SignalOutput>();

export const InMemorySignalStore = {
  save(output: SignalOutput): SignalOutput {
    store.set(output.id, output);
    return output;
  },

  findById(id: string): SignalOutput | undefined {
    return store.get(id);
  },

  findAll(): SignalOutput[] {
    return Array.from(store.values());
  },
};
