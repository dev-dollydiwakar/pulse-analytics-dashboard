"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { useSize } from "@/hooks/use-size";
import { Icon, type IconName } from "./icons";

export type Command = {
  id: string;
  group: string;
  label: string;
  icon: IconName;
  /** Extra words the search should match ("7d", "export"…). */
  keywords?: string;
  /** Small badge on the right, e.g. "Current". */
  hint?: string;
  run: () => void;
};

const spring = { type: "spring", stiffness: 520, damping: 34 } as const;

/** Every word of the query has to appear in the label or the keywords. */
function matches(command: Command, query: string): boolean {
  const text = `${command.label} ${command.keywords ?? ""}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).filter(Boolean).every((word) => text.includes(word));
}

type CommandPaletteProps = { open: boolean; onClose: () => void; commands: Command[] };

/** Ctrl / ⌘ K command palette: type to filter, ↑ ↓ to move, Enter to run, Esc to close. */
export function CommandPalette({ open, onClose, commands }: CommandPaletteProps) {
  return <AnimatePresence>{open && <Palette key="palette" onClose={onClose} commands={commands} />}</AnimatePresence>;
}

function Palette({ onClose, commands }: Omit<CommandPaletteProps, "open">) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [listRef, { height }] = useSize<HTMLDivElement>();
  const results = useMemo(() => commands.filter((c) => matches(c, query)), [commands, query]);
  const current = Math.min(active, results.length - 1);

  function run(command?: Command) {
    if (!command) return;
    command.run();
    onClose();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") return onClose();
    if (!results.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((current + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[current]);
    }
  }

  return (
    <>
      <motion.div className="fixed inset-0 z-40 bg-graphite/55 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={onClose} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="fixed top-[16vh] left-1/2 z-50 w-[min(560px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-[22px] border border-bone/[.12] bg-[#141416]/85 shadow-[0_40px_120px_-30px_rgba(0,0,0,.95),0_0_70px_-24px_rgba(198,244,50,.45)] backdrop-blur-2xl"
        initial={{ opacity: 0, scale: 0.92, y: -14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8, transition: { duration: 0.18 } }}
        transition={spring}
      >
        <div className="flex items-center gap-3 border-b border-bone/[.08] px-5 py-4">
          <Icon name="search" className="size-5 text-lime" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Type a command or search…"
            aria-label="Search commands"
            className="min-w-0 flex-1 bg-transparent text-[16px] text-bone caret-lime outline-none placeholder:text-smoke"
          />
          <Kbd>Esc</Kbd>
        </div>

        {/* The list height springs to its content, so filtering feels smooth. */}
        <motion.div animate={{ height }} transition={spring} className="overflow-hidden">
          <div ref={listRef} className="max-h-[340px] overflow-y-auto">
            <div className="p-2">
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((c, i) => (
                  <motion.div key={c.id} layout="position" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }} transition={spring}>
                    {(i === 0 || results[i - 1].group !== c.group) && <p className="px-3 pt-2 pb-1.5 text-[11px] font-semibold tracking-[.14em] text-smoke uppercase">{c.group}</p>}
                    <button
                      type="button"
                      onClick={() => run(c)}
                      onPointerMove={() => setActive(i)}
                      className={`relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium transition-colors ${i === current ? "text-bone" : "text-smoke"}`}
                    >
                      {i === current && <motion.span layoutId="command-active" className="absolute inset-0 rounded-xl border border-lime/25 bg-lime/[.08]" transition={spring} />}
                      <span className={`relative grid size-8 place-items-center rounded-lg transition-colors ${i === current ? "bg-lime text-graphite" : "bg-bone/[.06] text-bone"}`}>
                        <Icon name={c.icon} className="size-4" />
                      </span>
                      <span className="relative flex-1 truncate">{c.label}</span>
                      {c.hint && <span className="relative rounded-full bg-lime/12 px-2 py-0.5 font-mono text-[11px] font-semibold text-lime">{c.hint}</span>}
                      {i === current && <span className="relative font-mono text-[13px] text-smoke">↵</span>}
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {!results.length && <p className="px-3 py-8 text-center text-[13px] text-smoke">No results for “{query}”</p>}
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-4 border-t border-bone/[.08] px-5 py-3 text-[11.5px] text-smoke">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            navigate
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd>
            run
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>Esc</Kbd>
            close
          </span>
          <span className="ml-auto flex items-center gap-1.5 font-semibold text-lime">
            <Icon name="sparkle" className="size-3.5" />
            Pulse
          </span>
        </div>
      </motion.div>
    </>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="grid h-5 min-w-5 place-items-center rounded-md bg-bone/10 px-1.5 font-sans text-[10.5px] font-semibold text-bone">{children}</kbd>;
}
