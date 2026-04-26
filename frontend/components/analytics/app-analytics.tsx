"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  resolveRouteGroup,
  setAnalyticsContext,
  trackEvent,
  trackPageView,
} from "@/lib/analytics";

const SESSION_OPEN_KEY = "xguard-analytics-app-opened";

export function AppAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPageRef = useRef<string | null>(null);

  const queryString = searchParams?.toString() ?? "";
  const pagePath = useMemo(
    () => (queryString ? `${pathname}?${queryString}` : pathname),
    [pathname, queryString]
  );

  useEffect(() => {
    let cancelled = false;

    const trackCurrentPage = async () => {
      if (!pathname || lastTrackedPageRef.current === pagePath) {
        return;
      }

      lastTrackedPageRef.current = pagePath;

      const routeGroup = resolveRouteGroup(pathname);

      await setAnalyticsContext({ routeGroup });

      if (cancelled) {
        return;
      }

      await trackPageView({
        location: window.location.href,
        pathname: pagePath,
        routeGroup,
        title: document.title,
      });

      if (cancelled) {
        return;
      }

      try {
        if (!window.sessionStorage.getItem(SESSION_OPEN_KEY)) {
          window.sessionStorage.setItem(SESSION_OPEN_KEY, new Date().toISOString());
          await trackEvent("app_opened", {
            entry_path: pagePath,
            route_group: routeGroup,
          });
        }
      } catch {
        // Ignore browsers that block sessionStorage access.
      }

      if (routeGroup === "dashboard") {
        await trackEvent("dashboard_viewed");
      }
    };

    void trackCurrentPage();

    return () => {
      cancelled = true;
    };
  }, [pagePath, pathname]);

  return null;
}
