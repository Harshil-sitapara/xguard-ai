"use client"

import * as React from "react"
import { Slot } from "radix-ui"

type CollapsibleContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null)

function useCollapsibleContext() {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error("Collapsible components must be used within <Collapsible>")
  }
  return context
}

function Collapsible({
  children,
  defaultOpen = false,
  open,
  onOpenChange,
}: React.PropsWithChildren<{
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}>) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = open !== undefined
  const actualOpen = isControlled ? open : internalOpen

  const setOpen = React.useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
    (value) => {
      const nextValue = typeof value === "function" ? value(actualOpen) : value
      if (!isControlled) {
        setInternalOpen(nextValue)
      }
      onOpenChange?.(nextValue)
    },
    [actualOpen, isControlled, onOpenChange]
  )

  return (
    <CollapsibleContext.Provider value={{ open: actualOpen, setOpen }}>
      <div data-state={actualOpen ? "open" : "closed"}>{children}</div>
    </CollapsibleContext.Provider>
  )
}

function CollapsibleTrigger({
  asChild = false,
  onClick,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { open, setOpen } = useCollapsibleContext()
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-state={open ? "open" : "closed"}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          setOpen((prev) => !prev)
        }
      }}
      {...props}
    />
  )
}

function CollapsibleContent({
  forceMount = false,
  children,
  ...props
}: React.ComponentProps<"div"> & { forceMount?: boolean }) {
  const { open } = useCollapsibleContext()

  if (!open && !forceMount) {
    return null
  }

  return (
    <div data-state={open ? "open" : "closed"} {...props}>
      {children}
    </div>
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
