import { ApiProvider } from './ApiProvider';
import { AuthProvider, useAuthContext } from './AuthProvider';
import { ContextsProvider } from './ContextsProvider';
import { EnvironmentProvider } from './EnvironmentProvider';
import { FlagsProvider } from './FlagsProvider';
import { IFrameProvider, useIFrameContext } from './IFrameProvider';
import { ProjectProvider } from './ProjectProvider';

interface ApiBundleProviderProps {
  authUrl: string;
  clientSideId?: string;
  providedProjectKey?: string;
  children: React.ReactNode;
}

/**
 * Persistent iframe component that handles authentication and API communication.
 * Must be rendered inside both IFrameProvider and AuthProvider.
 * Supports automatic retry with exponential backoff on load errors.
 */
function PersistentIFrame() {
  const { ref, iframeSrc, iframeKey, hasExhaustedRetries, onIFrameError } = useIFrameContext();
  const { authenticating } = useAuthContext();

  if (hasExhaustedRetries) {
    return null;
  }

  const src = authenticating
    ? `${iframeSrc}/toolbar/authenticating.html?originUrl=${window.location.origin}`
    : `${iframeSrc}/toolbar/index.html?originUrl=${window.location.origin}`;

  return (
    <iframe
      key={iframeKey}
      ref={ref}
      src={src}
      title="LaunchDarkly Toolbar Auth"
      style={{ display: 'none' }}
      onError={onIFrameError}
    />
  );
}

export function ApiBundleProvider(props: ApiBundleProviderProps) {
  const { authUrl, clientSideId, providedProjectKey, children } = props;

  return (
    <IFrameProvider authUrl={authUrl}>
      <AuthProvider>
        {/* Persistent iframe for auth and API calls - always mounted */}
        <PersistentIFrame />
        <ApiProvider>
          <ProjectProvider clientSideId={clientSideId} providedProjectKey={providedProjectKey}>
            <EnvironmentProvider clientSideId={clientSideId}>
              <FlagsProvider>
                <ContextsProvider>{children}</ContextsProvider>
              </FlagsProvider>
            </EnvironmentProvider>
          </ProjectProvider>
        </ApiProvider>
      </AuthProvider>
    </IFrameProvider>
  );
}
