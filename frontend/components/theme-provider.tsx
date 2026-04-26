"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { setAnalyticsContext, trackEvent } from "@/lib/analytics";

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      enableColorScheme={false}
      disableTransitionOnChange={false}
      forcedTheme={undefined}
      storageKey="xguard-theme"
      themes={["light", "dark"]}
      {...props}
    >
      <ThemeAnalyticsSync />
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeAnalyticsSync() {
  const { resolvedTheme } = useTheme()
  const previousThemeRef = React.useRef<string | undefined>(undefined)

  React.useEffect(() => {
    if (!resolvedTheme) {
      return
    }

    void setAnalyticsContext({ theme: resolvedTheme })

    if (
      previousThemeRef.current &&
      previousThemeRef.current !== resolvedTheme
    ) {
      void trackEvent("theme_changed", { theme: resolvedTheme })
    }

    previousThemeRef.current = resolvedTheme
  }, [resolvedTheme])

  return null
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }
