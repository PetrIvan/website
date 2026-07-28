import type { HandleClientError } from '@sveltejs/kit';
import { deploymentAssetRecoveryKey } from '$lib/client/deploymentAssetRecovery';

const deploymentAssetFailurePatterns = [
	/Failed to fetch dynamically imported module/i,
	/error loading dynamically imported module/i,
	/Importing a module script failed/i,
	/Unable to preload CSS/i,
	/ChunkLoadError/i,
	/Loading (?:CSS )?chunk \d+ failed/i
];

function isDeploymentAssetFailure(error: unknown) {
	const errorText =
		error instanceof Error ? `${error.name}: ${error.message}` : String(error ?? '');

	return deploymentAssetFailurePatterns.some((pattern) => pattern.test(errorText));
}

export const handleError: HandleClientError = ({ error, event, message }) => {
	console.error(error);

	if (isDeploymentAssetFailure(error)) {
		try {
			const targetUrl = event.url.href;

			if (sessionStorage.getItem(deploymentAssetRecoveryKey) !== targetUrl) {
				sessionStorage.setItem(deploymentAssetRecoveryKey, targetUrl);
				if (location.href === targetUrl) location.reload();
				else location.assign(targetUrl);
			}
		} catch {
			// Preserve the normal error page instead of risking an unguarded reload loop.
		}
	}

	return { message };
};
