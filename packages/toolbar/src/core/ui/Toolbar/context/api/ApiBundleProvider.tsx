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
 */
function PersistentIFrame() {
  const { ref, iframeSrc } = useIFrameContext();
  const { authenticating } = useAuthContext();

  // The iframe source changes based on authentication state:
  // - authenticating.html: Shows while popup auth is in progress
  // - index.html: Normal state for auth checks and API calls
  const src = authenticating
    ? `${iframeSrc}/toolbar/authenticating.html?originUrl=${window.location.origin}`
    : `${iframeSrc}/toolbar/index.html?originUrl=${window.location.origin}`;

  return <iframe ref={ref} src={src} title="LaunchDarkly Toolbar Auth" style={{ display: 'none' }} />;
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
