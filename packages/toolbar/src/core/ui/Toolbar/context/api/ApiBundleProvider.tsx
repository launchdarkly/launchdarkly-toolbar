import { ApiProvider } from './ApiProvider';
import { AuthProvider } from './AuthProvider';
import { FlagsProvider } from './FlagsProvider';
import { IFrameProvider } from './IFrameProvider';
import { ProjectProvider } from './ProjectProvider';

interface ApiBundleProviderProps {
  authUrl: string;
  clientSideId?: string;
  providedProjectKey?: string;
  children: React.ReactNode;
}

export function ApiBundleProvider(props: ApiBundleProviderProps) {
  const { authUrl, clientSideId, providedProjectKey, children } = props;

  return (
    <IFrameProvider authUrl={authUrl}>
      <AuthProvider>
        <ApiProvider>
          <ProjectProvider clientSideId={clientSideId} providedProjectKey={providedProjectKey}>
            <FlagsProvider>{children}</FlagsProvider>
          </ProjectProvider>
        </ApiProvider>
      </AuthProvider>
    </IFrameProvider>
  );
}
