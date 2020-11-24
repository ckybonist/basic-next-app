import * as Sentry from '@sentry/node';
import { RewriteFrames, Dedupe, Debug } from '@sentry/integrations';

const isDebugMode = () =>
  typeof window !== 'undefined'
    ? new URL(window.location.href).searchParams.get('sentry_debug') === 'true'
    : false;

const withDedupe = () =>
  typeof window !== 'undefined'
    ? new URL(window.location.href).searchParams.get('dedupe') === 'true'
    : false;

export const init = () => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const integrations = [];
    if (
      process.env.NEXT_IS_SERVER === 'true' &&
      process.env.NEXT_PUBLIC_SENTRY_SERVER_ROOT_DIR
    ) {
      // For Node.js, rewrite Error.stack to use relative paths, so that source
      // maps starting with ~/_next map to files in Error.stack with path
      // app:///_next
      integrations.push(
        new RewriteFrames({
          iteratee: (frame) => {
            frame.filename = frame.filename.replace(
              process.env.NEXT_PUBLIC_SENTRY_SERVER_ROOT_DIR,
              'app:///'
            );
            frame.filename = frame.filename.replace('.next', '_next');
            return frame;
          }
        })
      );
    }

    if (isDebugMode()) {
      integrations.push(new Debug());
    }

    if (withDedupe()) {
      integrations.push(new Dedupe());
    }

    Sentry.init({
      debug: isDebugMode(),
      enabled: process.env.NODE_ENV === 'production' || isDebugMode(),
      integrations,
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      release: process.env.NEXT_PUBLIC_COMMIT_SHA,
      beforeSend(event, hint) {
        const error = hint?.originalException;
        if (
          error &&
          typeof error !== 'string' &&
          error.message &&
          error.message.includes('DROP_BY_BEFORESEND')
        )
          return null;

        return event;
      }
    });
  }
};
