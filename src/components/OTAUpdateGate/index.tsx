import { Fragment } from 'react';

import { useOTAUpdate } from '@app/hooks/useOTAUpdate';
import { UpdatePrompt } from '@app/components/UpdatePrompt';
import { RuntimeBadge } from '@app/components/RuntimeBadge';

/**
 * Single owner of the EAS Update lifecycle.
 *
 * - Mounts `useOTAUpdate()` exactly once so cold-start + foreground checks do not duplicate.
 * - Feeds state into `<UpdatePrompt />` (user-facing restart modal) and
 *   `<RuntimeBadge />` (dev/preview-only QA overlay).
 *
 * Mount this **inside** the root layout, once, at the top of the tree.
 */
export const OTAUpdateGate = () => {
  const ota = useOTAUpdate();

  return (
    <Fragment>
      <UpdatePrompt
        isUpdateReady={ota.isUpdateReady}
        isApplying={ota.isApplying}
        releaseNotes={ota.releaseNotes}
        applyUpdate={ota.applyUpdate}
        dismissUpdate={ota.dismissUpdate}
      />
      <RuntimeBadge
        runtimeVersion={ota.runtimeVersion}
        channel={ota.channel}
        updateId={ota.updateId}
        isUpdateAvailable={ota.isUpdateAvailable}
        isUpdatePending={ota.isUpdatePending}
        isChecking={ota.isChecking}
        isDownloading={ota.isDownloading}
        checkForUpdate={ota.checkForUpdate}
      />
    </Fragment>
  );
};
