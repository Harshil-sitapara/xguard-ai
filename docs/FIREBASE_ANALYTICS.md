# Firebase Analytics for XGuard Frontend

This app now supports Firebase Analytics in the `frontend` Next.js app only.

## Required environment variables

Add these values to the frontend runtime environment before testing in Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

The implementation is anonymous by design. Do not pass emails, names, IPs, packet payloads, prediction IDs, API tokens, or raw traffic data to Firebase Analytics.

## What gets tracked

- Automatic context:
  - `tracking_mode=anonymous`
  - `deployment_env`
  - `route_group`
  - `theme`
- Manual events:
  - `app_opened`
  - `landing_dashboard_cta_click`
  - `dashboard_viewed`
  - `replay_start_success`
  - `replay_stop_success`
  - `replay_error`
  - `shap_open`
  - `shap_load_success`
  - `shap_load_error`
  - `theme_changed`
- Manual page views:
  - `page_view` for `/` and `/dashboard`, including App Router navigations

## Verification flow

1. Add the Firebase env vars to the frontend environment.
2. Open the app locally and navigate through `/` and `/dashboard`.
3. Use Firebase Analytics DebugView to confirm events arrive in near real time.
4. Enable BigQuery export from the Firebase project for long-form analysis.

Note: Firebase documents that the first BigQuery export can take up to 48 hours, and then exports continue on a daily sync.

## Starter BigQuery queries

Replace ``your_project.analytics_XXXXXXXX`` with your exported dataset.

### App opens by day

```sql
SELECT
  event_date,
  COUNT(*) AS app_open_events,
  COUNT(DISTINCT user_pseudo_id) AS unique_anonymous_visitors
FROM `your_project.analytics_XXXXXXXX.events_*`
WHERE event_name = 'app_opened'
GROUP BY event_date
ORDER BY event_date DESC;
```

### Pages visited

```sql
SELECT
  event_date,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_path') AS page_path,
  COUNT(*) AS page_views,
  COUNT(DISTINCT user_pseudo_id) AS unique_visitors
FROM `your_project.analytics_XXXXXXXX.events_*`
WHERE event_name = 'page_view'
GROUP BY event_date, page_path
ORDER BY event_date DESC, page_views DESC;
```

### Landing to dashboard funnel

```sql
WITH landing_clicks AS (
  SELECT DISTINCT user_pseudo_id
  FROM `your_project.analytics_XXXXXXXX.events_*`
  WHERE event_name = 'landing_dashboard_cta_click'
),
dashboard_views AS (
  SELECT DISTINCT user_pseudo_id
  FROM `your_project.analytics_XXXXXXXX.events_*`
  WHERE event_name = 'dashboard_viewed'
)
SELECT
  (SELECT COUNT(*) FROM landing_clicks) AS users_who_clicked_dashboard_cta,
  (SELECT COUNT(*) FROM dashboard_views) AS users_who_viewed_dashboard,
  (
    SELECT COUNT(*)
    FROM landing_clicks lc
    JOIN dashboard_views dv USING (user_pseudo_id)
  ) AS users_who_completed_funnel;
```
