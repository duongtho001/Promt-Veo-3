import React from 'react';
import type { TranslationKeys } from '../translations';

interface PromptHelperProps {
  onInsertTag: (tag: string) => void;
  t: TranslationKeys;
}

const PromptHelper: React.FC<PromptHelperProps> = ({ onInsertTag, t }) => {
  const tagGroups = t.promptHelperTags as any;
  const tagOrder = ['cam', 'subj', 'char', 'set', 'mood', 'fx', 'clr', 'snd', 'edit', 'rndr', 'sty', 'tim', 'focal'];

  return (
    <div className="mt-2 p-3 bg-[#0D0D0F] border border-gray-600 rounded-lg text-xs space-y-3">
      <h4 className="font-semibold text-gray-400">{t.promptHelperTitle}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {tagOrder.map(key => {
          if (!tagGroups[key]) return null;
          const { group, tags } = tagGroups[key];
          return (
            <div key={group}>
              <p className="text-gray-500 font-medium mb-1 truncate" title={group}>{group}</p>
              <div className="flex flex-col gap-1">
                {tags.map(({ tag, desc }: { tag: string, desc: string }) => (
                  <button
                    key={tag}
                    title={desc}
                    onClick={() => onInsertTag(tag)}
                    className="w-full text-left bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-cyan-800/70 hover:text-cyan-200 transition-colors"
                  >
                    {tag.replace(/\n/g, '').trim()}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PromptHelper;
