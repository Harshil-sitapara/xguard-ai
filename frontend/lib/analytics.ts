"use client";

import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import {
  getAnalytics,
  initializeAnalytics,
  isSupported,
  logEvent,
  setDefaultEventParameters,
  setUserProperties,
  type Analytics,
  type EventParams,
} from "firebase/analytics";

type Primitive = string | number | boolean;
type AnalyticsPayload = Record<string, Primitive | null | undefined>;
type AnalyticsContext = {
  routeGroup?: string;
  theme?: string;
  deploymentEnv?: string;
};

type PageViewPayload = {
  location?: string;
  pathname: string;
  routeGroup?: string;
  title?: string;
};

const deploymentEnv =
  process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || "development";

function parseBooleanEnv(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

const analyticsEnabled = parseBooleanEnv(
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED,
  true
);

const disableAnalyticsInDevelopment = parseBooleanEnv(
  process.env.NEXT_PUBLIC_DISABLE_ANALYTICS_IN_DEVELOPMENT,
  true
);

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const requiredConfigKeys: Array<keyof FirebaseOptions> = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
  "measurementId",
];

let analyticsPromise: Promise<Analytics | null> | null = null;
let hasWarnedMissingConfig = false;
let hasWarnedDisabledState = false;
let currentContext: AnalyticsContext = { deploymentEnv };

function hasFirebaseConfig() {
  return requiredConfigKeys.every((key) => {
    const value = firebaseConfig[key];
    return typeof value === "string" && value.length > 0;
  });
}

function normalizeValue(value: Primitive) {
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return value;
}

function toEventParams(payload: AnalyticsPayload): EventParams {
  return Object.fromEntries(
    Object.entries(payload).flatMap(([key, value]) =>
      value === undefined || value === null
        ? []
        : [[key, normalizeValue(value)]]
    )
  ) as EventParams;
}

function warnMissingConfig() {
  if (hasWarnedMissingConfig) {
    return;
  }

  hasWarnedMissingConfig = true;
  console.warn(
    "Firebase Analytics is disabled because NEXT_PUBLIC_FIREBASE_* variables are missing."
  );
}

function warnDisabledState(reason: string) {
  if (hasWarnedDisabledState) {
    return;
  }

  hasWarnedDisabledState = true;
  console.info(reason);
}

function isDevelopmentLikeEnvironment() {
  if (deploymentEnv === "development" || deploymentEnv === "local") {
    return true;
  }

  if (typeof window === "undefined") {
    return false;
  }

  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function shouldDisableAnalytics() {
  if (!analyticsEnabled) {
    warnDisabledState(
      "Firebase Analytics is disabled because NEXT_PUBLIC_ANALYTICS_ENABLED is false."
    );
    return true;
  }

  if (disableAnalyticsInDevelopment && isDevelopmentLikeEnvironment()) {
    warnDisabledState(
      "Firebase Analytics is disabled in local/development. Set NEXT_PUBLIC_DISABLE_ANALYTICS_IN_DEVELOPMENT=false to enable it."
    );
    return true;
  }

  return false;
}

function getUserProperties() {
  return toEventParams({
    deployment_env: currentContext.deploymentEnv ?? deploymentEnv,
    route_group: currentContext.routeGroup,
    theme: currentContext.theme,
    tracking_mode: "anonymous",
  });
}

function applyAnalyticsContext(analytics: Analytics) {
  const params = getUserProperties();

  setDefaultEventParameters(params);
  setUserProperties(analytics, params);
}

async function getAnalyticsClient(): Promise<Analytics | null> {
  if (shouldDisableAnalytics()) {
    return null;
  }

  if (!hasFirebaseConfig()) {
    warnMissingConfig();
    return null;
  }

  if (!analyticsPromise) {
    analyticsPromise = (async () => {
      const supported = await isSupported();

      if (!supported) {
        return null;
      }

      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

      let analytics: Analytics;

      try {
        analytics = initializeAnalytics(app, {
          config: {
            allow_ad_personalization_signals: false,
            allow_google_signals: false,
            send_page_view: false,
          },
        });
      } catch {
        analytics = getAnalytics(app);
      }

      applyAnalyticsContext(analytics);
      return analytics;
    })().catch((error) => {
      console.error("Firebase Analytics initialization failed.", error);
      return null;
    });
  }

  return analyticsPromise;
}

export function resolveRouteGroup(pathname: string) {
  if (pathname === "/") {
    return "landing";
  }

  if (pathname.startsWith("/dashboard")) {
    return "dashboard";
  }

  return "other";
}

export async function setAnalyticsContext(context: AnalyticsContext) {
  currentContext = {
    ...currentContext,
    ...context,
  };

  if (!currentContext.deploymentEnv) {
    currentContext.deploymentEnv = deploymentEnv;
  }

  const analytics = await getAnalyticsClient();

  if (!analytics) {
    return;
  }

  applyAnalyticsContext(analytics);
}

export async function trackEvent(
  eventName: string,
  payload: AnalyticsPayload = {}
) {
  const analytics = await getAnalyticsClient();

  if (!analytics) {
    return;
  }

  logEvent(analytics, eventName, toEventParams(payload));
}

export async function trackPageView({
  location,
  pathname,
  routeGroup,
  title,
}: PageViewPayload) {
  if (routeGroup) {
    currentContext = {
      ...currentContext,
      routeGroup,
    };
  }

  const analytics = await getAnalyticsClient();

  if (!analytics) {
    return;
  }

  logEvent(
    analytics,
    "page_view",
    toEventParams({
      page_location: location,
      page_path: pathname,
      page_title: title,
      route_group: routeGroup ?? currentContext.routeGroup,
    })
  );
}
