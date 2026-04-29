import { AnimatePresence, motion } from "framer-motion";

import { Children, isValidElement, cloneElement } from "react";

export function AnimatedGrid({ children, keyProp }: { children: React.ReactNode, keyProp: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
      <AnimatePresence mode="popLayout">
        {Children.map(children, (child, idx) =>
          isValidElement(child) ? (
            <motion.div
              key={child.key || idx}
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -24 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              layout
            >
              {cloneElement(child)}
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </div>
  );
}
